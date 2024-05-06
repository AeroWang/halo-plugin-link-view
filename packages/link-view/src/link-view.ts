import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SiteInfo } from "./types";
import varStyles from "./var";

@customElement("link-view")
export class LinkView extends LitElement {
  @property({ type: String, attribute: "href" })
  siteHref = "";

  @property({ type: String, attribute: "target" })
  openType = "_blank";

  @property()
  type = "";

  @state()
  loading = true;

  @state()
  private _siteInfo: SiteInfo = {
    title: "",
    description: "",
    iconUrl: "",
  };

  @state()
  private isEditor: boolean = false;

  override render() {
    return this.type === "title-view"
      ? html`
          ${
            this.loading
              ? html`<span>Loading...</span>`
              : html`<div class="title-box">
                  <img .src=${this._siteInfo.iconUrl} alt="" />
                  <a .href=${this.siteHref} .target=${this.openType}>${this._siteInfo.title}</a>
                </div> `
          }
        </div>`
      : html`<div class="link-box">
          ${this.loading
            ? html`<span>Loading...</span>`
            : html`<img .src=${this._siteInfo.iconUrl} alt="" class="book-mark-bg" /> ${this.isEditor
                  ? html`<div class="content">
                      <img .src=${this._siteInfo.iconUrl} alt="" class="normal-img" />
                      ${this.renderSiteContent()}
                    </div>`
                  : html`<a class="content" .href=${this.siteHref}>
                      <img .src=${this._siteInfo.iconUrl} alt="" class="normal-img" />
                      ${this.renderSiteContent()}
                    </a>`}`}
        </div>`;
  }

  renderSiteContent() {
    return html`<div class="info">
      <div class="title">${this._siteInfo.title}</div>
      <div class="description">${this._siteInfo.description}</div>
      ${this.isEditor
        ? html`<a class="belong" .href=${this.siteHref} .target=${this.openType}>${this.siteHref}</a>`
        : html`<div class="belong">${this.siteHref}</div>`}
    </div>`;
  }

  async fetchSiteInfo(url: string) {
    try {
      this.loading = true;
      const response = await fetch(`/link-view/api/parse-web?url=${url}`, {
        method: "GET",
        credentials: "same-origin",
      });

      const jsonData = await response.json();
      if (jsonData.code !== 200) {
        throw Error("请求失败");
      }
      this._siteInfo = jsonData.data;
    } catch (error) {
      console.error("Failed to fetch site info", error);
    } finally {
      this.loading = false;
    }
  }
  override connectedCallback() {
    super.connectedCallback();
    // @ts-ignore
    this.isEditor = !!window.RichTextEditor;
    if (this.siteHref && this.siteHref !== "") {
      this.fetchSiteInfo(this.siteHref);
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("href")) {
      this.fetchSiteInfo(this.siteHref);
    }
  }

  static override styles = [
    varStyles,
    css`
      * {
        box-sizing: border-box;
      }

      .link-box {
        width: var(--box-width);
        position: relative;
        min-height: 100px;
        padding: 12px 18px;
        margin: 0 auto;
        background-color: #f4f5f5;
        overflow: hidden;

        border: 1px solid;
        border-color: var(--box-border-color);
        border-radius: 8px;
      }

      a {
        text-decoration: none;
        color: var(--link-color);
      }

      img {
        object-fit: cover;
        display: inline-block;
      }

      .book-mark-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 80%;
        height: 100%;
        -o-object-fit: cover;
        object-fit: cover;
        filter: blur(50px);
        opacity: 0.15;
        z-index: 1;
      }

      .content {
        position: relative;
        z-index: 2;
        display: inline-flex;
        width: 100%;
        overflow: hidden;
        align-items: center;
      }

      .content .normal-img {
        width: 78px;
        height: 78px;
        border-radius: 8px;
      }

      .info {
        width: 100%;
        overflow: hidden;
        margin-left: 16px;
      }

      .info .title {
        color: #1c1c1c;
        font-weight: 700;
        font-size: 15px;
        line-height: 26px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info .description {
        color: #585a5a;
        margin-top: 4px;
        font-size: 12px;
        line-height: 18px;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .info .belong {
        margin-top: 4px;
        font-size: 12px;
        line-height: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .link-title-box {
        display: inline-block;
      }
      .title-box {
        display: inline-flex;
        align-items: center;
      }
      .title-box img {
        width: 22px;
        height: 22px;
        border-radius: 5px;
        margin-right: 4px;
      }
    `,
  ];
}
