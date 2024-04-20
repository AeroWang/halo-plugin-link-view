import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SiteInfo } from "./types";


@customElement("link-view")
export class LinkView extends LitElement {
  @property({ type: String, reflect: true, attribute: "site-title" })
  siteTitle = "";

  @property({ type: String, reflect: true, attribute: "sitehref" })
  siteHref = "";

  @property({ type: String, reflect: true, attribute: "site-desc" })
  siteDesc = "";

  @property({ type: String, reflect: true, attribute: "site-icon" })
  siteIconUrl = "";

  @property({ type: String, reflect: true, attribute: "target" })
  openType = "_blank";

  @state()
  loading = false;

  @state()
  private _siteInfo: SiteInfo = {
    title: "",
    description: "",
    iconUrl: "",
  };

  override render() {
      if(this.siteHref === "") {
          return html`<div class="link-box">
              <input
                  @change=${this._onSiteHrefChange}
                  placeholder="输入网址"
                  class="bg-gray-50 rounded-md hover:bg-gray-100 block px-2 w-full py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
          </div>`;
      }
    return html`<div class="link-box">
      ${this.loading
        ? html`<span>Loading...</span>`
        : html`<img .src=${this.siteIconUrl} alt="" class="book-mark-bg" />
            <a class="content" .href=${this.siteHref}>
              <img .src=${this.siteIconUrl} alt="" class="normal-img" />
              <div class="info">
                <div class="title">${this.siteTitle}</div>
                <div class="description">${this.siteDesc}</div>
                <div class="belong">${this.siteHref}</div>
              </div>
            </a>`}
    </div>`;
  }

    _onSiteHrefChange(e: Event) {
        const target = e.target as HTMLInputElement;
        this.siteHref = target.value;
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
      this.siteTitle = this._siteInfo.title;
      this.siteDesc = this._siteInfo.description;
      this.siteIconUrl = this._siteInfo.iconUrl;
      this.openType = this._siteInfo.openType ?? "_blank";
      // TODO: 貌似没地方接收
      const detail = {};
      const event = new CustomEvent("update", { detail, bubbles: true, composed: true, cancelable: true });
      this.dispatchEvent(event);
    } catch (error) {
      console.error("Failed to fetch site info", error);
    } finally {
      this.loading = false;
    }
  }
  override connectedCallback() {
    super.connectedCallback();
    if(this.siteHref && this.siteHref !== "") {
        this.fetchSiteInfo(this.siteHref);
    }
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("siteHref")) {
      this.fetchSiteInfo(this.siteHref);
    }
  }

  static override styles = css`
    * {
      box-sizing: border-box;
    }

    .link-box {
      width: 100%;
      position: relative;
      min-height: 100px;
      padding: 12px 18px;
      background-color: #f4f5f5;
      overflow: hidden;

      border: 1px solid #e3e3e3;
      border-radius: 8px;
    }

    a {
      text-decoration: none;
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
  `;
}

/*
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { until } from "lit/directives/until.js";

const fetchData = async (url: string) => {
  const response = await fetch(`http://localhost:8788/site-info?url=${url}`);
  const jsonData = await response.json();
  // Add some delay for demo purposes
  await new Promise<void>((r) => setTimeout(() => r(), 1000));
  if (jsonData.message === "ok") {
    return html`<img .src=${jsonData.data.iconUrl} alt="" class="book-mark-bg" />
      <a class="content" .href=${url}>
        <img .src=${jsonData.data.iconUrl} alt="" class="normal-img" />
        <div class="info">
          <div class="title">${jsonData.data.title}</div>
          <div class="description">${jsonData.data.description}</div>
          <div class="belong">${jsonData.data.host}</div>
        </div>
      </a>`;
  }
  return url;
};

@customElement("link-view")
export class LinkView extends LitElement {
  @property()
  cardType = "cardType";
  @property()
  target = "_blank";
  // @property({ attribute: false })
  _href = "https://www.halo.run";
  _img = "https://www.halo.run/themes/theme-official-v2/assets/favicons/favicon-96x96.png";

  // @state()
  // private _siteInfo = {
  //   title: "",
  //   description: "",
  //   host: "",
  //   originHref: "",
  //   iconUrl: "",
  // };

  @state()
  private _content: Promise<unknown> = fetchData("https://www.github.com");

  constructor() {
    super();
    // this._fetchSiteInfo();
  }
  /!*  async _fetchSiteInfo() {
    let jsonData = {};
    const resp = await fetch(
      "http://localhost:8788/site-info?url=https://www.baidu.com"
    );
    jsonData = await resp.json();
    console.log(jsonData);
    if (jsonData.message === "ok") {
      this._siteInfo = jsonData.data;
      return html`<div class="link-box">
        <img .src=${jsonData.data.iconUrl} alt="" class="book-mark-bg" />
        <a class="content" .href=${this._href}>
          <img .src=${jsonData.data.iconUrl} alt="" class="normal-img" />
          <div class="info">
            <div class="title">${jsonData.data.title}</div>
            <div class="description">${jsonData.data.description}</div>
            <div class="belong">${jsonData.data.host}</div>
          </div>
        </a>
      </div>`;
    }
    // .then((response) => {
    //   return response.json();
    // })
    // .then((data) => {
    //   if (data.message === "ok") {
    //     this._siteInfo = data.data;
    //   }
    // });
  }*!/
  override connectedCallback() {
    super.connectedCallback();
    // this._fetchSiteInfo();
  }

  override render() {
    return html`<div class="link-box">${until(this._content, html`<span>Loading...</span>`)}</div>`;
    // return html` <div class="link-box">
    //   ${until(this._content, html`<span>Loading...</span>`)}
    // </div>`;
  }

  static override styles = css`
    * {
      box-sizing: border-box;
    }

    .link-box {
      width: 100%;
      position: relative;
      min-height: 100px;
      padding: 12px 18px;
      background-color: #f4f5f5;
      overflow: hidden;

      border: 1px solid #e3e3e3;
      border-radius: 8px;
    }

    a {
      text-decoration: none;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "link-view": LinkView;
  }
}
*/
