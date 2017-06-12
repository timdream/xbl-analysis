class XblSearchTextbox extends XblTextbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<hbox class="textbox-input-box" flex="1" xbl:inherits="context,spellcheck" align="center">
<input class="textbox-input" anonid="input" mozactionhint="search" xbl:inherits="value,type,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,mozactionhint,spellcheck">
</input>
<deck class="textbox-search-icons" anonid="search-icons">
<image class="textbox-search-icon" anonid="searchbutton-icon" xbl:inherits="src=image,label=searchbuttonlabel,searchbutton,disabled">
</image>
<image class="textbox-search-clear" onclick="document.getBindingParent(this)._clearSearch();" label="&searchTextBox.clear.label;" xbl:inherits="disabled">
</image>
</deck>
</hbox>`;
    let comment = document.createComment("Creating xbl-search-textbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set timeout(val) {
    this.setAttribute("timeout", val);
    return val;
  }

  get timeout() {
    return parseInt(this.getAttribute("timeout")) || 500;
  }

  get searchButton() {
    return this.getAttribute("searchbutton") == "true";
  }

  get value() {
    return this.inputField.value;
  }
}
customElements.define("xbl-search-textbox", XblSearchTextbox);
