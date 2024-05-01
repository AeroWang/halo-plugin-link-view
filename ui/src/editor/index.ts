import {
  type Editor,
  EditorState,
  isActive,
  mergeAttributes,
  Node,
  ExtensionLink,
  getMarkAttributes,
  getNodeAttributes,
  ExtensionText,
} from "@halo-dev/richtext-editor";
import { markRaw, type Component } from "vue";
import PreviewLinkIcon from "~icons/fluent/preview-link-24-filled";
import MdiLinkVariant from "~icons/mdi/link-variant";
import LinkViewBubbleMenuItem from "@/components/LinkViewBubbleMenuItem.vue";
import TextExtensionMenuItem from "@/components/TextExtensionMenuItem.vue";
import { splitLink } from "./utils";

export interface LinkViewType {
  key: string;
  title: string;
  icon: Component;
  action: ({ editor }: { editor: Editor }) => void;
}

export const ExtensionLinkView = Node.create({
  name: "linkView",

  atom: true,

  group: "block",

  onUpdate(this) {
    // TODO: 貌似无用，监听不到子组件自发改变属性值（目的：在主题端不用再次请求接口）
    console.log(this, "onUpdate");
  },

  onBeforeCreate() {
    const itemKey = "export-text-link-view";
    this.editor.extensionManager.extensions.forEach((extension) => {
      if (extension.name == "text") {
        const bubbleMenu = extension.options?.getBubbleMenu?.({
          editor: this.editor,
        });
        if (!bubbleMenu?.items) {
          return;
        }
        const items = bubbleMenu.items;
        if (!items || items.length == 0) {
          return;
        }

        //@ts-ignore
        const linkViewItem = items.find((item) => item.key == itemKey);
        if (linkViewItem) {
          return;
        }

        items.push(
          {
            priority: 115,
            key: itemKey,
            component: markRaw(TextExtensionMenuItem),
            props: {
              type: () => {
                return linkViewTypes[0]
              },
              visible: ({ editor }: { editor: Editor }) => {
                return isActive(editor.state, ExtensionLink.name);
              },
            },
          }
        );
        extension.options.getBubbleMenu = () => {
          return {
            ...bubbleMenu,
            items,
          };
        };
      }
    });
  },

  addAttributes() {
    return {
      sitehref: {
        default: null,
        parseHTML: (element: any) => {
          return element.getAttribute("sitehref");
        },
      },
      type: {
        default: linkViewTypes[1].key,
        parseHTML: (element: any) => {
          return element.getAttribute("type");
        },
      }
    };
  },

  addOptions() {
    return {
      ...this.parent?.(),
      getBubbleMenu() {
        return {
          pluginKey: "linkViewBubbleMenu",
          shouldShow: ({ state }: { state: EditorState }) => {
            return isActive(state, ExtensionLinkView.name);
          },
          defaultAnimation: false,
          items: [
            {
              priority: 10,
              component: markRaw(LinkViewBubbleMenuItem),
              props: {
                type: ({ editor }: { editor: Editor }) => {
                  const attr = getNodeAttributes(editor.state, ExtensionLinkView.name);
                  return linkViewTypes.find((type) => type.key == attr.type) || linkViewTypes[1];
                }
              },
            }
          ],
        };
      },
      // TODO: The drag-and-drop function of this component does not respond. 
      // Maybe it's because of the Web component?
      getDraggable() {
        return true;
      }
    };
  },
  parseHTML() {
    return [{ tag: "link-view" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["link-view", mergeAttributes(HTMLAttributes)];
  },
});

export const linkViewTypes: LinkViewType[] = [
  {
    key: "link",
    title: "链接视图",
    icon: markRaw(MdiLinkVariant),
    action: ({ editor }) => {
      if (!isActive(editor.state, ExtensionLinkView.name)) {
        return;
      }
      const linkViewAttr = getNodeAttributes(editor.state, ExtensionLinkView.name);
      if (!linkViewAttr || !linkViewAttr.sitehref) {
        return;
      }
      editor.commands.insertContent({
        // TODO: Use ExtensionParagraph to report an error Cannot read properties of undefined (reading 'name')
        type: "paragraph",
        content: [
          {
            type: ExtensionText.name,
            text: linkViewAttr.sitehref,
            marks: [{
              type: ExtensionLink.name,
              attrs: {
                href: linkViewAttr.sitehref,
              }
            }]
          }
        ]
      })
    },
  },
  {
    key: "card",
    title: "卡片视图",
    icon: markRaw(PreviewLinkIcon),
    action: ({ editor }) => {
      if (!isActive(editor.state, ExtensionLink.name)) {
        return;
      }
      editor.chain()
        .extendMarkRange(ExtensionLink.name)
        .command(({ tr }) => {
          return splitLink(tr);
        })
        .command(({ tr, state }) => {
          const linkAttr = getMarkAttributes(state, ExtensionLink.name);
          if (!linkAttr || !linkAttr.href) {
            return false;
          }
          tr.replaceSelectionWith(
            state.schema.nodes[ExtensionLinkView.name].create({
              sitehref: linkAttr.href,
              type: "card",
            })
          )
          return true;
        })
        .focus()
        .run();
    },
  },
];
