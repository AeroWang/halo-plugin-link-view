import {
  type Editor,
  Node,
  ToolboxItem,
  mergeAttributes,
} from "@halo-dev/richtext-editor";
import { markRaw } from "vue";
import TablerMath from "~icons/tabler/math";

export const ExtensionLinkView = Node.create({
  name: "linkView",
  atom: true,
  group: "block",
  defining: true,
  selectable: true,
  onUpdate(this) {
    // TODO: 貌似无用，监听不到子组件自发改变属性值（目的：在主题端不用再次请求接口）
    console.log(this, "onUpdate");
  },
  addAttributes() {
    return {
      "site-href": {
        default: "https://www.baidu.com",
      },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 100,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(TablerMath),
              title: "LinkView",
              action: () => {
                editor
                  .chain()
                  .insertContent([{ type: "linkView" }])
                  .run();
              },
            },
          },
        ];
      },
    };
  },
  parseHTML() {
    return [{ tag: "link-view" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["link-view", mergeAttributes(HTMLAttributes)];
  },
});
