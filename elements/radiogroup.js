class XblRadiogroup extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-radiogroup ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-radiogroup", XblRadiogroup);