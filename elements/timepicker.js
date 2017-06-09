class XblTimepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-timepicker ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-timepicker", XblTimepicker);
