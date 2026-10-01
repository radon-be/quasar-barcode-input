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
import { ref } from "vue";

const value = ref("");

function handleClear() {
  value.value = "";
}

function handleSearch(searchValue: string) {
  console.log("Search:", searchValue);
}

function handleScan(scanValue: string) {
  console.log("Scan:", scanValue);
}
</script>
