class FirefoxAutorepeatbutton extends FirefoxScrollboxBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="autorepeatbutton-icon"></xul:image>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}