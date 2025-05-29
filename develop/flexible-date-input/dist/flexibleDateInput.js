"use strict";
(() => {
  // src/globals.ts
  var api = window.PluginApi;
  var { React, ReactDOM, patch } = api;

  // src/components/DateInputHelper.tsx
  var DateInputHelper = ({
    error,
    value,
    onValueChange
  }) => {
    if (!error)
      return null;
    const format = () => {
      const compactMatch = value.match(/^(\d{4})(\d{2})(\d{2})$/);
      if (compactMatch) {
        const [, year, month, day] = compactMatch;
        return `${year}-${month}-${day}`;
      }
      const trimmedValue = value.trim();
      const isEpoch = /^\d+$/.test(trimmedValue);
      const date = isEpoch ? new Date(Number(trimmedValue)) : new Date(trimmedValue);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      return null;
    };
    const attemptToFix = () => {
      const newValue = format();
      if (newValue) {
        onValueChange(newValue);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { style: { fontSize: ".875em" } }, /* @__PURE__ */ React.createElement(
      "a",
      {
        href: "#",
        onClick: (e) => {
          e.preventDefault();
          attemptToFix();
        },
        role: "button",
        tabIndex: 0
      },
      "Attempt to fix?"
    ));
  };
  var DateInputHelper_default = DateInputHelper;

  // src/flexibleDateInput.tsx
  (function() {
    patch.after("DateInput", function(props, _, result) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, result, /* @__PURE__ */ React.createElement(DateInputHelper_default, { ...props }));
    });
  })();
})();
