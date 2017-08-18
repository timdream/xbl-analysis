class FirefoxTabbrowserBrowser extends FirefoxBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-tabbrowser-browser");
    this.prepend(comment);

    Object.defineProperty(this, "tabModalPromptBox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.tabModalPromptBox;
        return (this.tabModalPromptBox = null);
      },
      set(val) {
        delete this["tabModalPromptBox"];
        return (this["tabModalPromptBox"] = val);
      }
    });
  }
  disconnectedCallback() {}
  loadURIWithFlags(aURI, aFlags, aReferrerURI, aCharset, aPostData) {
    var params = arguments[1];
    if (typeof params == "number") {
      params = {
        flags: aFlags,
        referrerURI: aReferrerURI,
        charset: aCharset,
        postData: aPostData
      };
    }
    _loadURIWithFlags(this, aURI, params);
  }
}
customElements.define("firefox-tabbrowser-browser", FirefoxTabbrowserBrowser);