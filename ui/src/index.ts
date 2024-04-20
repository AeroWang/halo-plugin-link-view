import { definePlugin } from "@halo-dev/console-shared";
import HomeView from "./views/HomeView.vue";
import { IconPlug } from "@halo-dev/components";
import { markRaw } from "vue";
import { ExtensionLinkView } from "@/components";
// TODO: 还需 Java 处理注入主题端
import "./link-view.iife.js";

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
        path: "/example",
        name: "Example",
        component: HomeView,
        meta: {
          title: "示例页面",
          searchable: true,
          menu: {
            name: "示例页面",
            group: "示例分组",
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [ExtensionLinkView];
    },
  },
});
