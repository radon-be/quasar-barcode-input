<template>
  <q-input
    ref="inputRef"
    v-model="search"
    :label="label"
    :loading="loading"
    :autofocus="autofocus"
    clearable
    dense
    data-1p-ignore
    @clear="emit('clear')"
  >
    <template #append>
      <slot name="append">
        <QIcon name="search" />
      </slot>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { QIcon, QInput } from "quasar";
import { nextTick, ref, toRef, watch } from "vue";
import {
  useBarcodeCapture,
  type BarcodeCaptureType
} from "./useBarcodeCapture";

const props = withDefaults(
  defineProps<{
    /** Text displayed as the input label. */
    label?: string;
    /** Shows the Quasar input loading indicator. */
    loading?: boolean;
    /** Focuses the input when it is mounted. */
    autofocus?: boolean;
    /** Delay in milliseconds before emitting search for typed input. */
    debounce?: number;
    /** Enables global keyboard-wedge barcode capture. */
    capture?: boolean;
    /** Character set accepted by the scanner capture. */
    captureType?: BarcodeCaptureType;
    /** Custom regular expression for characters accepted from the scanner. */
    capturePattern?: RegExp;
    /** Minimum barcode length accepted by the scanner. */
    minLength?: number;
    /** Inactivity delay in milliseconds before a barcode is flushed. */
    scanDebounce?: number;
  }>(),
  {
    label: "Search",
    loading: false,
    autofocus: true,
    debounce: 500,
    capture: false,
    captureType: "alphanumeric",
    minLength: 1,
    scanDebounce: 100
  }
);

const emit = defineEmits<{
  search: [value: string];
  scan: [value: string];
  clear: [];
}>();

const model = defineModel<string>({ default: "" });
const search = ref(model.value);
const inputRef = ref<QInput | null>(null);
let skipDebouncedValue: string | undefined;

watch(
  search,
  value => {
    if (skipDebouncedValue !== undefined && value !== skipDebouncedValue) {
      skipDebouncedValue = undefined;
    }
  },
  { flush: "sync" }
);

const emitSearch = async (value: string) => {
  model.value = value;
  emit("search", value);
  await nextTick();
  inputRef.value?.select();
};

watchDebounced(
  search,
  async value => {
    if (skipDebouncedValue !== undefined) {
      const skippedValue = skipDebouncedValue;
      skipDebouncedValue = undefined;
      if (value === skippedValue) return;
    }
    await emitSearch(value ?? "");
  },
  { debounce: props.debounce }
);

watch(
  model,
  value => {
    search.value = value ?? "";
  },
  { immediate: true }
);

useBarcodeCapture({
  enabled: toRef(props, "capture"),
  captureType: props.captureType,
  pattern: props.capturePattern,
  minCharLength: props.minLength,
  debounceMs: props.scanDebounce,
  onScan: async value => {
    skipDebouncedValue = value;
    search.value = value;
    emit("scan", value);
    await emitSearch(value);
  }
});

const focus = () => {
  inputRef.value?.focus();
};

defineExpose({ focus });
</script>
