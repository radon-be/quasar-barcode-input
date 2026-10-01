import { type BarcodeSearchInput as BarcodeSearchInputComponent } from "@radon-be/quasar-app-extension-barcode-input";

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    BarcodeSearchInput: typeof BarcodeSearchInputComponent;
  }
}

export {};
