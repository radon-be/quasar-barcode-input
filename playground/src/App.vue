<template>
  <div class="q-pa-md">
    <div class="row q-mb-sm">
      <BarcodeSearchInput
        v-model="value"
        @clear="handleClear"
        @search="handleSearch"
        @scan="handleScan"
        capture
      />
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarcodeSearchInput } from "@radon-be/quasar-app-extension-barcode-input";
import { ref } from "vue";

const value = ref<string>();
const handleClear = () => {
  value.value = "";

  console.log("Clear");
};
const handleSearch = (searchValue: string) => {
  console.log("Search:", searchValue);
};
const handleScan = (scanValue: string) => {
  console.log("Scan:", scanValue);
};
</script>
