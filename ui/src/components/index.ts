import {
  type Editor,
  EditorState,
  isActive,
  mergeAttributes,
  Node,
  NodeBubbleMenu,
  ToolboxItem,
} from "@halo-dev/richtext-editor";
import {markRaw} from "vue";
import PreviewLinkIcon from '~icons/fluent/preview-link-24-filled';
import BubbleLinkHref from "@/components/BubbleLinkHref.vue";

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
      sitehref: {
        default: null,
        parseHTML: (element : any) => {
          return element.getAttribute("sitehref");
        },
      },
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getCommandMenuItems() {
        return [
          {
            priority: 100,
            icon: markRaw(PreviewLinkIcon),
            title: "LinkView",
            keywords: ["link", "linkview", "href"],
            command: ({ editor, range }: { editor: Editor; range: Range }) => {
              editor
                .chain()
                .focus()
                .deleteRange(range)
                .insertContent([{ type: "linkView" }])
                .run();
            },
          },
        ];
      },
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 100,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(PreviewLinkIcon),
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
      getBubbleMenu({editor}: { editor: Editor }): NodeBubbleMenu {
        return {
          pluginKey: "linkViewBubbleMenu",
          shouldShow: ({state}: { state: EditorState }) => {
            return isActive(state, ExtensionLinkView.name);
          },
          items: [
            {
              priority: 10,
              component: markRaw(BubbleLinkHref),
            },
          ],
        };
      },
    }
  },
  parseHTML() {
    return [{ tag: "link-view" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["link-view", mergeAttributes(HTMLAttributes)];
  },
});
