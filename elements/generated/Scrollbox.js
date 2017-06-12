class XblScrollbox extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<box class="box-inherit scrollbox-innerbox" xbl:inherits="orient,align,pack,dir" flex="1">
<children>
</children>
</box>`;
    let comment = document.createComment("Creating xbl-scrollbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbox", XblScrollbox);
