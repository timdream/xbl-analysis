class XblColorpickertile extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-colorpickertile ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-colorpickertile", XblColorpickertile);