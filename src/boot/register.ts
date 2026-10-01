import { boot } from "quasar/wrappers";
import { BarcodeSearchInput } from "../components";

export default boot(({ app }) => {
  app.component("BarcodeSearchInput", BarcodeSearchInput);
});
