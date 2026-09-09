const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "../externalLinksEnhanced.js"), "utf8");
const definition = (name, address = `${name}.example`) => ({
  name, icon: `${name}.png`, addresses: [address],
});

// Exercise the plugin's registered component with a minimal React hook host.
// No Stash server, browser, or additional dependencies are required.
function mount({ bundled = [], personal, urls = [], direct = false, fetchDefinitions, fetchPersonal } = {}) {
  let callback;
  let settings = { open_singlelinks_directly: direct };
  let inputURLs = urls;
  let cursor = 0;
  let dirty = true;
  let output;
  let unmounted = false;
  let updatesAfterUnmount = 0;
  const slots = [];
  const effects = [];
  const errors = [];
  const iconRequests = [];
  class SVGElement {
    constructor(outerHTML) { this.outerHTML = outerHTML; }
  }
  const sameDeps = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const React = {
    Fragment: "Fragment",
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
    useState(initial) {
      const index = cursor++;
      slots[index] ??= { value: initial };
      return [slots[index].value, (value) => {
        if (unmounted) updatesAfterUnmount++;
        const next = typeof value === "function" ? value(slots[index].value) : value;
        if (!Object.is(next, slots[index].value)) {
          slots[index].value = next;
          dirty = true;
        }
      }];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      const previous = slots[index];
      if (!sameDeps(previous?.deps, deps)) {
        slots[index] = { deps };
        effects.push(() => {
          previous?.cleanup?.();
          slots[index].cleanup = effect();
        });
      }
    },
    useMemo(factory, deps) {
      const index = cursor++;
      if (!sameDeps(slots[index]?.deps, deps)) {
        slots[index] = { deps, value: factory() };
      }
      return slots[index].value;
    },
  };
  const Dropdown = Object.assign(function Dropdown() { }, { Toggle: "Toggle", Menu: "Menu", Item: "Item" });
  vm.runInNewContext(source, {
    SVGElement,
    DOMParser: class {
      parseFromString(svg) { return { querySelector: () => new SVGElement(svg) }; }
    },
    console: { error: (...args) => errors.push(args) },
    fetch: async (url, options) => {
      assert.equal(options.cache, "no-store");
      if (url.endsWith(".svg")) {
        iconRequests.push(url);
        return { ok: true, text: async () => `<svg data-source="${url}"></svg>` };
      }
      if (url === "./plugin/externalLinksEnhanced/assets/custom/custom.json") {
        if (fetchPersonal) return fetchPersonal();
        return personal === undefined
          ? { ok: false, status: 404 }
          : { ok: true, json: async () => JSON.parse(personal) };
      }
      assert.equal(url, "./plugin/externalLinksEnhanced/assets/default/default.json");
      return fetchDefinitions ? fetchDefinitions() : { ok: true, json: async () => bundled };
    },
    window: {
      PluginApi: {
        React, ReactDOM: {}, components: {},
        libraries: { FontAwesomeSolid: {}, FontAwesomeBrands: {}, Bootstrap: { Button: "Button", Dropdown } },
        utils: { StashService: { useConfiguration: () => ({ data: { configuration: { plugins: { externalLinksEnhanced: settings } } } }) } },
        patch: { instead: (name, fn) => { assert.equal(name, "ExternalLinkButtons"); callback = fn; } },
      }
    },
  });
  return {
    errors,
    iconRequests,
    async flush() {
      for (let attempt = 0; attempt < 20; attempt++) {
        if (dirty) {
          dirty = false;
          cursor = 0;
          const component = callback({ urls: inputURLs });
          output = component.type(component.props);
          effects.splice(0).forEach((effect) => effect());
        }
        await new Promise(setImmediate);
        if (!dirty) return;
      }
      throw new Error("Plugin did not settle");
    },
    update(nextSettings, nextURLs = inputURLs) {
      settings = { ...settings, ...nextSettings };
      inputURLs = nextURLs;
      dirty = true;
    },
    buttons: () => output?.children[0] ?? [],
    isLoading: () => output === null,
    unmount: () => {
      unmounted = true;
      slots.forEach((slot) => slot?.cleanup?.());
    },
    updatesAfterUnmount: () => updatesAfterUnmount,
    Dropdown,
  };
}

test("personal definitions survive replacement of bundled definitions on update", async () => {
  const personal = JSON.stringify([definition("mine"), definition("shared", "override.example")]);
  const manifest = fs.readFileSync(path.join(__dirname, "../manifest"), "utf8");
  const packageFiles = Array.from(manifest.matchAll(/^- (.+)\r?$/gm), (match) => match[1].trim());
  assert.ok(packageFiles.includes("default/default.json"));
  assert.ok(packageFiles.includes("example/example.json"));
  assert.ok(!packageFiles.some((file) => file.startsWith("custom/")));
  const installed = new Map([
    ["custom/custom.json", personal],
    ["custom/myicon.png", "personal icon data"],
  ]);
  for (const bundled of [[definition("shared")], [definition("shared", "updated.example"), definition("new")]]) {
    // Mirror Stash's update algorithm: remove old manifest files, then extract
    // the next package. User-owned paths must never become package files.
    packageFiles.forEach((file) => installed.delete(file));
    packageFiles.forEach((file) => installed.set(file, file === "default/default.json" ? JSON.stringify(bundled) : "package data"));
    assert.equal(installed.get("custom/custom.json"), personal);
    assert.equal(installed.get("custom/myicon.png"), "personal icon data");
    const app = mount({ bundled: JSON.parse(installed.get("default/default.json")), personal: installed.get("custom/custom.json"), urls: ["https://mine.example/user", "https://override.example/user"] });
    await app.flush();
    assert.deepEqual(Array.from(app.buttons(), (button) => button.props.className), ["mine", "shared"]);
    assert.equal(app.errors.length, 0);
    app.unmount();
  }
});

test("raster and SVG icons resolve relative to their definition directory", async () => {
  const assetRoot = "./plugin/externalLinksEnhanced/assets";
  const app = mount({
    bundled: [
      { ...definition("bundled"), icon: "same.png" },
      { ...definition("bundled-svg"), icon: "same.svg" },
      { ...definition("overridden"), icon: "original.png" },
    ],
    personal: JSON.stringify([
      { ...definition("personal"), icon: "same.png" },
      { ...definition("personal-svg"), icon: "same.svg" },
      { ...definition("overridden"), icon: "replacement.png" },
    ]),
    urls: ["bundled", "personal", "bundled-svg", "personal-svg", "overridden"].map((name) => `https://${name}.example/user`),
  });
  await app.flush();
  const icons = Array.from(app.buttons(), (button) => {
    const rendered = button.type(button.props);
    const icon = rendered.children[0].children[0];
    return icon.type(icon.props);
  });
  assert.equal(icons[0].props.src, `${assetRoot}/defaults/same.png`);
  assert.equal(icons[1].props.src, `${assetRoot}/custom/same.png`);
  assert.equal(icons[4].props.src, `${assetRoot}/custom/replacement.png`);
  assert.deepEqual(app.iconRequests, [`${assetRoot}/defaults/same.svg`, `${assetRoot}/custom/same.svg`]);
  assert.ok(icons[2].props.dangerouslySetInnerHTML.__html.includes("/defaults/same.svg"));
  assert.ok(icons[3].props.dangerouslySetInnerHTML.__html.includes("/custom/same.svg"));
  assert.equal(app.errors.length, 0);
  app.unmount();
});

test("all packaged assets exist and bundled definitions reference defaults", () => {
  const root = path.join(__dirname, "..");
  const manifest = fs.readFileSync(path.join(root, "manifest"), "utf8");
  for (const match of manifest.matchAll(/^- (.+)\r?$/gm)) {
    assert.ok(fs.existsSync(path.join(root, match[1].trim())), match[1]);
  }
  for (const item of JSON.parse(fs.readFileSync(path.join(root, "default/default.json"), "utf8"))) {
    assert.ok(fs.existsSync(path.join(root, "defaults", item.icon)), item.icon);
  }
  assert.ok(Array.isArray(JSON.parse(fs.readFileSync(path.join(root, "example/example.json"), "utf8"))));
});

test("a missing personal file preserves bundled definitions without logging an error", async () => {
  const app = mount({ bundled: [definition("bundled")], urls: ["https://bundled.example/user"] });
  await app.flush();
  assert.equal(app.buttons()[0].props.className, "bundled");
  assert.equal(app.errors.length, 0);
  app.unmount();
});

test("empty or unavailable bundled definitions do not hide built-in icons", async () => {
  for (const fetchDefinitions of [
    async () => ({ ok: true, json: async () => [] }),
    async () => ({ ok: false, status: 404 }),
    async () => { throw new Error("network error"); },
    async () => ({ ok: true, json: async () => { throw new Error("invalid JSON"); } }),
  ]) {
    const app = mount({ fetchDefinitions, personal: JSON.stringify([definition("mine")]), urls: ["https://x.com/user", "https://mine.example/user"] });
    await app.flush();
    assert.equal(app.isLoading(), false);
    assert.deepEqual(Array.from(app.buttons(), (button) => button.props.className), ["twitter", "mine"]);
    app.unmount();
  }
});

test("malformed personal JSON falls back to bundled and built-in definitions", async () => {
  for (const personal of ["", "{broken", "{}", "null", "42"]) {
    const app = mount({ personal, urls: ["https://x.com/user"] });
    await app.flush();
    assert.equal(app.buttons()[0].props.className, "twitter");
    assert.equal(app.errors.length, 1);
    app.unmount();
  }
});

test("an empty personal array is valid and failed personal requests preserve defaults", async () => {
  const app = mount({ personal: "[]", urls: ["https://x.com/user"] });
  await app.flush();
  assert.equal(app.buttons()[0].props.className, "twitter");
  assert.equal(app.errors.length, 0);
  app.unmount();
  for (const fetchPersonal of [
    async () => ({ ok: false, status: 500 }),
    async () => { throw new Error("network error"); },
  ]) {
    const failed = mount({ fetchPersonal, urls: ["https://x.com/user"] });
    await failed.flush();
    assert.equal(failed.buttons()[0].props.className, "twitter");
    assert.equal(failed.errors.length, 1);
    failed.unmount();
  }
});

test("invalid entries cannot break valid entries or replace a valid bundled definition", async () => {
  const app = mount({
    bundled: [definition("shared")],
    personal: JSON.stringify([null, { name: "shared" }, { ...definition("bad"), regex: "[" }, definition("bad-address", "["), definition("mine")]),
    urls: ["https://shared.example/user", "https://mine.example/user"],
  });
  await app.flush();
  assert.deepEqual(Array.from(app.buttons(), (button) => button.props.className), ["shared", "mine"]);
  assert.equal(app.errors.length, 4);
  app.unmount();
});

test("setting and URL changes remove stale groups and preserve single-link behavior", async () => {
  const app = mount({ personal: JSON.stringify([definition("mine")]), direct: true, urls: ["https://mine.example/one", "https://mine.example/one"] });
  await app.flush();
  let button = app.buttons()[0];
  let rendered = button.type(button.props);
  assert.equal(rendered.type, "div");
  assert.equal(rendered.children[0].props.href, "https://mine.example/one");
  assert.equal(rendered.children[0].props.target, "_blank");
  assert.equal(rendered.children[0].props.rel, "noopener noreferrer");
  app.update({}, ["https://mine.example/one", "https://mine.example/two"]);
  await app.flush();
  button = app.buttons()[0];
  assert.equal(button.type(button.props).type, app.Dropdown);
  app.update({}, ["https://unknown.example/one"]);
  await app.flush();
  assert.equal(app.buttons()[0].props.className, "other");
  app.update({ open_singlelinks_directly: false });
  await app.flush();
  button = app.buttons()[0];
  assert.equal(button.type(button.props).type, app.Dropdown);
  app.update({}, []);
  await app.flush();
  assert.equal(app.buttons().length, 0);
  app.unmount();
});

test("a pending load cannot update an unmounted component", async () => {
  let resolveDefinitions;
  const app = mount({
    personal: JSON.stringify([definition("old")]),
    urls: ["https://new.example/user"],
    fetchDefinitions: () => new Promise((resolve) => { resolveDefinitions = resolve; }),
  });
  await app.flush();
  assert.equal(app.isLoading(), true);
  app.unmount();
  resolveDefinitions({ ok: true, json: async () => [] });
  await app.flush();
  assert.equal(app.updatesAfterUnmount(), 0);
});
