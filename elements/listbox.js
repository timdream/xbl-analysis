class XblListbox extends XblListboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="listcols">
<listcols>
<listcol flex="1">
</listcol>
</listcols>
</children>
<listrows>
<children includes="listhead">
</children>
<listboxbody xbl:inherits="rows,size,minheight">
<children includes="listitem">
</children>
</listboxbody>
</listrows>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listbox", XblListbox);
