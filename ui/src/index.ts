import { definePlugin } from "@halo-dev/console-shared";
import { ExtensionLinkView } from "@/components";
// TODO: 还需 Java 处理注入主题端
import "./link-view.iife.js";

export default definePlugin({

  extensionPoints: {
    "default:editor:extension:create": () => {
      return [ExtensionLinkView];
    },
  },
});
