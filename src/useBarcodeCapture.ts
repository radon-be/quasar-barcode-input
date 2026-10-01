import { useEventListener, watchDebounced } from "@vueuse/core";
import { ref, type Ref, watch } from "vue";

export type BarcodeCaptureType = "numeric" | "alpha" | "alphanumeric";

export type UseBarcodeCaptureOptions = {
  onScan?: (value: string) => void | Promise<void>;
  target?: Ref<string>;
  captureType?: BarcodeCaptureType;
  pattern?: RegExp;
  minCharLength?: number;
  debounceMs?: number;
  ignoreWhenTyping?: boolean;
  enabled?: Ref<boolean>;
};

const capturePatterns: Record<BarcodeCaptureType, RegExp> = {
  numeric: /^[0-9]$/,
  alpha: /^[a-zA-Z]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
};

export function useBarcodeCapture(options: UseBarcodeCaptureOptions = {}) {
  const buffer = ref("");
  const capturePattern =
    options.pattern ?? capturePatterns[options.captureType ?? "alphanumeric"];
  const minCharLength = Math.max(0, options.minCharLength ?? 1);

  watch(buffer, (value) => {
    if (options.target && value) {
      options.target.value = value;
    }
  });

  const flush = async () => {
    if (!buffer.value) return;
    const value = buffer.value;
    buffer.value = "";
    if (value.length < minCharLength) {
      if (options.target) options.target.value = "";
      return;
    }
    await options.onScan?.(value);
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (options.enabled?.value === false) return;
    if ((event.key === "Enter" || event.key === "Tab") && buffer.value) {
      event.preventDefault();
      event.stopPropagation();
      void flush();
      return;
    }
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (!capturePattern.test(event.key)) return;

    const target = event.target as HTMLElement | null;
    const isTypingInField =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable === true;
    if (options.ignoreWhenTyping !== false && isTypingInField) return;

    event.preventDefault();
    buffer.value += event.key;
  };

  watchDebounced(
    buffer,
    () => {
      void flush();
    },
    { debounce: options.debounceMs ?? 500 },
  );

  if (typeof window !== "undefined") {
    useEventListener(window, "keydown", handleKeydown, { capture: true });
  }

  return { buffer, flush };
}
