class XblWindowdragbox extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-windowdragbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-windowdragbox", XblWindowdragbox);
