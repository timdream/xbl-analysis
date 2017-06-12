class XblToolbarbuttonImage extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="toolbarbutton-icon" xbl:inherits="src=image">
</image>`;
    let comment = document.createComment("Creating xbl-toolbarbutton-image");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton-image", XblToolbarbuttonImage);