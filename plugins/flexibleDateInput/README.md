# Flexible Date Input

A helper for date formatting.

## How it works

The plugin starts by checking for regex patterns to match date formats.

The first pattern is for a compact date `20260407`.

The second pattern is for a Japanese date `2026年04月07日`.

If those matches fail, it uses JavaScript's Date() to parse the value.

If a match is found, it will adjust the value to `YYYY-MM-DD`. Otherwise, the value doesn't change in the input field.