# @radon-be/quasar-app-extension-barcode-input

Vue 3 and Quasar 2 barcode scanning composable and search input.

## Install

```bash
npm install @radon-be/quasar-app-extension-barcode-input vue quasar @vueuse/core
```

Requires Vue 3, Quasar 2, and Node.js 22.12 or newer.

### Install as a Quasar App Extension

For Quasar CLI projects, install the extension to register `BarcodeSearchInput` globally:

```bash
quasar ext add @radon-be/quasar-app-extension-barcode-input
```

The extension globally registers `BarcodeSearchInput` in Quasar CLI projects. The component and composable remain available as named imports.

When installed as an extension, use `<BarcodeSearchInput />` without importing the component.

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { BarcodeSearchInput } from "@radon-be/quasar-app-extension-barcode-input";

const filter = ref("");
const handleFilter = (value: string) => console.log(value);
const clearForm = () => (filter.value = "");
</script>

<template>
  <BarcodeSearchInput
    v-model="filter"
    label="Barcode"
    capture
    capture-type="numeric"
    :min-length="8"
    @search="handleFilter"
    @clear="clearForm"
  />
</template>
```

Set `capture` to enable keyboard-wedge scanner capture. Captured characters are read from page-level keyboard events, so this is intended for scanners that act like a keyboard, not camera-based scanning. Scans are emitted on `Enter`, `Tab`, or after the scanner inactivity delay.

## Props

| Prop             | Type                                     | Default          | Description                              |
| ---------------- | ---------------------------------------- | ---------------- | ---------------------------------------- |
| `label`          | `string`                                 | `"Search"`       | Input label                              |
| `loading`        | `boolean`                                | `false`          | Shows the Quasar input loading state     |
| `autofocus`      | `boolean`                                | `true`           | Focuses the input on mount               |
| `debounce`       | `number`                                 | `500`            | Typed-input delay in milliseconds        |
| `capture`        | `boolean`                                | `false`          | Enables page-level barcode capture       |
| `captureType`    | `"numeric" \| "alpha" \| "alphanumeric"` | `"alphanumeric"` | Accepted scanner character set           |
| `capturePattern` | `RegExp`                                 | `undefined`      | Custom scanner character pattern         |
| `minLength`      | `number`                                 | `1`              | Minimum accepted scan length             |
| `scanDebounce`   | `number`                                 | `100`            | Scanner inactivity delay in milliseconds |

`v-model` is a string and defaults to `""`.

## Events

| Event    | Payload  | Description                                                  |
| -------- | -------- | ------------------------------------------------------------ |
| `search` | `string` | Emitted after typed-input debounce or immediately for a scan |
| `scan`   | `string` | Emitted when a barcode is captured                           |
| `clear`  | none     | Forwarded from the Quasar input clear action                 |

The `useBarcodeCapture` composable is also exported for applications that need scanner capture without the input component.

```ts
import { useBarcodeCapture } from "@radon-be/quasar-app-extension-barcode-input";

useBarcodeCapture({
  captureType: "numeric",
  minCharLength: 8,
  onScan: value => console.log(value)
});
```
