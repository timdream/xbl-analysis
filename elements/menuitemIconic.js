class XblMenuitemIconic extends XblMenuitem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="menu-iconic-left" align="center" pack="center" xbl:inherits="selected,_moz-menuactive,disabled,checked">
<image class="menu-iconic-icon" xbl:inherits="src=image,validate,src">
</image>
</hbox>
<label class="menu-iconic-text" flex="1" xbl:inherits="value=label,accesskey,crop,highlightable" crop="right">
</label>
<label class="menu-iconic-highlightable-text" xbl:inherits="xbl:text=label,crop,accesskey,highlightable" crop="right">
</label>
<children>
</children>
<hbox class="menu-accel-container" anonid="accel">
<label class="menu-iconic-accel" xbl:inherits="value=acceltext">
</label>
</hbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menuitem-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menuitem-iconic", XblMenuitemIconic);