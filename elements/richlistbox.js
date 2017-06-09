class XblRichlistbox extends XblListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="listheader">
</children>
<scrollbox allowevents="true" orient="vertical" anonid="main-box" flex="1" style="overflow: auto;" xbl:inherits="dir,pack">
<children>
</children>
</scrollbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-richlistbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-richlistbox", XblRichlistbox);