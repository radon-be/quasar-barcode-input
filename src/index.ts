import type { IndexAPI } from "@quasar/app-vite";

export default function (api: IndexAPI) {
  api.extendQuasarConf((conf) => {
    conf.boot?.push(
      "~@radon-be/quasar-app-extension-barcode-input/dist/boot/register.js",
    );
  });
}
