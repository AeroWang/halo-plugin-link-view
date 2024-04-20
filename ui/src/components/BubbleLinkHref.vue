<script setup lang="ts">
import type { Editor } from "@halo-dev/richtext-editor";
import { computed, type Component } from "vue";
import { ExtensionLinkView } from "./index";

const props = defineProps<{
  editor: Editor;
  isActive: ({ editor }: { editor: Editor }) => boolean;
  visible?: ({ editor }: { editor: Editor }) => boolean;
  icon?: Component;
  title?: string;
  action?: ({ editor }: { editor: Editor }) => void;
}>();

const href = computed({
  get: () => {
    return props.editor.getAttributes(ExtensionLinkView.name).sitehref;
  },
  set: (href: string) => {
    props.editor.chain().updateAttributes(ExtensionLinkView.name, { sitehref : href }).run();
  },
});
</script>

<template>
  <input
    v-model.lazy="href"
    placeholder="输入网址"
    class="bg-gray-50 rounded-md hover:bg-gray-100 block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  />
</template>
