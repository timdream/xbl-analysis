class XblScale extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<slider anonid="slider" class="scale-slider" snap="true" flex="1" xbl:inherits="disabled,orient,dir,curpos=value,minpos=min,maxpos=max,increment,pageincrement,movetoclick">
<thumb class="scale-thumb" xbl:inherits="disabled,orient">
</thumb>
</slider>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-scale ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scale", XblScale);