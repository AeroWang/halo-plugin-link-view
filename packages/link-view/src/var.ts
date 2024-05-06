import { css } from "lit";

const varStyles = css`
  :host {
    /* Box */
    --box-width: var(--halo-editor-link-view-box-width, 100%);
    --link-color: var(--halo-editor-link-view-link-color, #0969da);
    --box-border-color: var(--halo-editor-link-view-box-border-color, #e3e3e3);
  }
`;

export default varStyles;
