class FirefoxPrintpreviewtoolbar extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:button label="FROM-DTD-print-label" accesskey="FROM-DTD-print-accesskey" oncommand="this.parentNode.print();" icon="print"></xul:button>
      <xul:button anonid="pageSetup" label="FROM-DTD-pageSetup-label" accesskey="FROM-DTD-pageSetup-accesskey" oncommand="this.parentNode.doPageSetup();"></xul:button>
      <xul:vbox align="center" pack="center">
        <xul:label value="FROM-DTD-page-label" accesskey="FROM-DTD-page-accesskey" control="pageNumber"></xul:label>
      </xul:vbox>
      <xul:toolbarbutton anonid="navigateHome" class="navigate-button tabbable" oncommand="parentNode.navigate(0, 0, 'home');" tooltiptext="FROM-DTD-homearrow-tooltip"></xul:toolbarbutton>
      <xul:toolbarbutton anonid="navigatePrevious" class="navigate-button tabbable" oncommand="parentNode.navigate(-1, 0, 0);" tooltiptext="FROM-DTD-previousarrow-tooltip"></xul:toolbarbutton>
      <xul:hbox align="center" pack="center">
        <xul:textbox id="pageNumber" size="3" value="1" min="1" type="number" hidespinbuttons="true" onchange="navigate(0, this.valueNumber, 0);"></xul:textbox>
        <xul:label value="FROM-DTD-of-label"></xul:label>
        <xul:label value="1"></xul:label>
      </xul:hbox>
      <xul:toolbarbutton anonid="navigateNext" class="navigate-button tabbable" oncommand="parentNode.navigate(1, 0, 0);" tooltiptext="FROM-DTD-nextarrow-tooltip"></xul:toolbarbutton>
      <xul:toolbarbutton anonid="navigateEnd" class="navigate-button tabbable" oncommand="parentNode.navigate(0, 0, 'end');" tooltiptext="FROM-DTD-endarrow-tooltip"></xul:toolbarbutton>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:vbox align="center" pack="center">
        <xul:label value="FROM-DTD-scale-label" accesskey="FROM-DTD-scale-accesskey" control="scale"></xul:label>
      </xul:vbox>
      <xul:hbox align="center" pack="center">
        <xul:menulist id="scale" crop="none" oncommand="parentNode.parentNode.scale(this.selectedItem.value);">
          <xul:menupopup>
            <xul:menuitem value="0.3" label="FROM-DTD-p30-label"></xul:menuitem>
            <xul:menuitem value="0.4" label="FROM-DTD-p40-label"></xul:menuitem>
            <xul:menuitem value="0.5" label="FROM-DTD-p50-label"></xul:menuitem>
            <xul:menuitem value="0.6" label="FROM-DTD-p60-label"></xul:menuitem>
            <xul:menuitem value="0.7" label="FROM-DTD-p70-label"></xul:menuitem>
            <xul:menuitem value="0.8" label="FROM-DTD-p80-label"></xul:menuitem>
            <xul:menuitem value="0.9" label="FROM-DTD-p90-label"></xul:menuitem>
            <xul:menuitem value="1" label="FROM-DTD-p100-label"></xul:menuitem>
            <xul:menuitem value="1.25" label="FROM-DTD-p125-label"></xul:menuitem>
            <xul:menuitem value="1.5" label="FROM-DTD-p150-label"></xul:menuitem>
            <xul:menuitem value="1.75" label="FROM-DTD-p175-label"></xul:menuitem>
            <xul:menuitem value="2" label="FROM-DTD-p200-label"></xul:menuitem>
            <xul:menuseparator></xul:menuseparator>
            <xul:menuitem flex="1" value="ShrinkToFit" label="FROM-DTD-ShrinkToFit-label"></xul:menuitem>
            <xul:menuitem value="Custom" label="FROM-DTD-Custom-label"></xul:menuitem>
          </xul:menupopup>
        </xul:menulist>
      </xul:hbox>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:hbox align="center" pack="center">
        <xul:toolbarbutton label="FROM-DTD-portrait-label" checked="true" accesskey="FROM-DTD-portrait-accesskey" type="radio" group="orient" class="toolbar-portrait-page tabbable" oncommand="parentNode.parentNode.orient('portrait');"></xul:toolbarbutton>
        <xul:toolbarbutton label="FROM-DTD-landscape-label" accesskey="FROM-DTD-landscape-accesskey" type="radio" group="orient" class="toolbar-landscape-page tabbable" oncommand="parentNode.parentNode.orient('landscape');"></xul:toolbarbutton>
      </xul:hbox>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:checkbox label="FROM-DTD-simplifyPage-label" checked="false" disabled="true" accesskey="FROM-DTD-simplifyPage-accesskey" tooltiptext-disabled="FROM-DTD-simplifyPage-disabled-tooltip" tooltiptext-enabled="FROM-DTD-simplifyPage-enabled-tooltip" oncommand="this.parentNode.simplify();"></xul:checkbox>
      <xul:toolbarseparator class="toolbarseparator-primary"></xul:toolbarseparator>
      <xul:button label="FROM-DTD-close-label" accesskey="FROM-DTD-close-accesskey" oncommand="PrintUtils.exitPrintPreview();" icon="close"></xul:button>
      <xul:data value="FROM-DTD-customPrompt-title"></xul:data>
    `;
    this.mPrintButton = document.getAnonymousNodes(this)[0];

    this.mPageSetupButton = document.getAnonymousElementByAttribute(this, "anonid", "pageSetup");

    this.mNavigateHomeButton = document.getAnonymousElementByAttribute(this, "anonid", "navigateHome");

    this.mNavigatePreviousButton = document.getAnonymousElementByAttribute(this, "anonid", "navigatePrevious");

    this.mPageTextBox = document.getAnonymousNodes(this)[5].childNodes[0];

    this.mNavigateNextButton = document.getAnonymousElementByAttribute(this, "anonid", "navigateNext");

    this.mNavigateEndButton = document.getAnonymousElementByAttribute(this, "anonid", "navigateEnd");

    this.mTotalPages = document.getAnonymousNodes(this)[5].childNodes[2];

    this.mScaleLabel = document.getAnonymousNodes(this)[9].firstChild;

    this.mScaleCombobox = document.getAnonymousNodes(this)[10].firstChild;

    this.mOrientButtonsBox = document.getAnonymousNodes(this)[12];

    this.mPortaitButton = this.mOrientButtonsBox.childNodes[0];

    this.mLandscapeButton = this.mOrientButtonsBox.childNodes[1];

    this.mSimplifyPageCheckbox = document.getAnonymousNodes(this)[14];

    this.mSimplifyPageNotAllowed = this.mSimplifyPageCheckbox.disabled;

    this.mSimplifyPageToolbarSeparator = document.getAnonymousNodes(this)[15];

    this.mCustomTitle = document.getAnonymousNodes(this)[17].firstChild;

    this.mPrintPreviewObs = "";

    this.mWebProgress = "";

    this.mPPBrowser = null;

    this.mMessageManager = null;

    this._setupEventListeners();
  }

  initialize(aPPBrowser) {
    let { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm", {});
    if (!Services.prefs.getBoolPref("print.use_simplify_page")) {
      this.mSimplifyPageCheckbox.hidden = true;
      this.mSimplifyPageToolbarSeparator.hidden = true;
    }
    this.mPPBrowser = aPPBrowser;
    this.mMessageManager = aPPBrowser.messageManager;
    this.mMessageManager.addMessageListener("Printing:Preview:UpdatePageCount", this);
    this.updateToolbar();

    let $ = id => document.getAnonymousElementByAttribute(this, "anonid", id);
    let ltr = document.documentElement.matches(":root:-moz-locale-dir(ltr)");
    // Windows 7 doesn't support ⏮ and ⏭ by default, and fallback doesn't
    // always work (bug 1343330).
    let { AppConstants } = ChromeUtils.import("resource://gre/modules/AppConstants.jsm", {});
    let useCompatCharacters = AppConstants.isPlatformAndVersionAtMost("win", "6.1");
    let leftEnd = useCompatCharacters ? "⏪" : "⏮";
    let rightEnd = useCompatCharacters ? "⏩" : "⏭";
    $("navigateHome").label = ltr ? leftEnd : rightEnd;
    $("navigatePrevious").label = ltr ? "◂" : "▸";
    $("navigateNext").label = ltr ? "▸" : "◂";
    $("navigateEnd").label = ltr ? rightEnd : leftEnd;
  }

  destroy() {
    this.mMessageManager.removeMessageListener("Printing:Preview:UpdatePageCount", this);
    delete this.mMessageManager;
    delete this.mPPBrowser;
  }

  disableUpdateTriggers(aDisabled) {
    this.mPrintButton.disabled = aDisabled;
    this.mPageSetupButton.disabled = aDisabled;
    this.mNavigateHomeButton.disabled = aDisabled;
    this.mNavigatePreviousButton.disabled = aDisabled;
    this.mPageTextBox.disabled = aDisabled;
    this.mNavigateNextButton.disabled = aDisabled;
    this.mNavigateEndButton.disabled = aDisabled;
    this.mScaleCombobox.disabled = aDisabled;
    this.mPortaitButton.disabled = aDisabled;
    this.mLandscapeButton.disabled = aDisabled;
    this.mSimplifyPageCheckbox.disabled = this.mSimplifyPageNotAllowed || aDisabled;
  }

  doPageSetup() {
    /* import-globals-from printUtils.js */
    var didOK = PrintUtils.showPageSetup();
    if (didOK) {
      // the changes that effect the UI
      this.updateToolbar();

      // Now do PrintPreview
      PrintUtils.printPreview();
    }
  }

  navigate(aDirection, aPageNum, aHomeOrEnd) {
    const nsIWebBrowserPrint = Ci.nsIWebBrowserPrint;
    let navType, pageNum;

    // we use only one of aHomeOrEnd, aDirection, or aPageNum
    if (aHomeOrEnd) {
      // We're going to either the very first page ("home"), or the
      // very last page ("end").
      if (aHomeOrEnd == "home") {
        navType = nsIWebBrowserPrint.PRINTPREVIEW_HOME;
        this.mPageTextBox.value = 1;
      } else {
        navType = nsIWebBrowserPrint.PRINTPREVIEW_END;
        this.mPageTextBox.value = this.mPageTextBox.max;
      }
      pageNum = 0;
    } else if (aDirection) {
      // aDirection is either +1 or -1, and allows us to increment
      // or decrement our currently viewed page.
      this.mPageTextBox.valueNumber += aDirection;
      navType = nsIWebBrowserPrint.PRINTPREVIEW_GOTO_PAGENUM;
      pageNum = this.mPageTextBox.value; // TODO: back to valueNumber?
    } else {
      // We're going to a specific page (aPageNum)
      navType = nsIWebBrowserPrint.PRINTPREVIEW_GOTO_PAGENUM;
      pageNum = aPageNum;
    }

    this.mMessageManager.sendAsyncMessage("Printing:Preview:Navigate", {
      navType,
      pageNum,
    });
  }

  print() {
    PrintUtils.printWindow(this.mPPBrowser.outerWindowID, this.mPPBrowser);
  }

  promptForScaleValue(aValue) {
    var value = Math.round(aValue);
    var promptStr = this.mScaleLabel.value;
    var renameTitle = this.mCustomTitle;
    var result = { value };
    let { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm", {});
    var confirmed = Services.prompt.prompt(window, renameTitle, promptStr, result, null, { value });
    if (!confirmed || (!result.value) || (result.value == "")) {
      return -1;
    }
    return result.value;
  }

  setScaleCombobox(aValue) {
    var scaleValues = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.25, 1.5, 1.75, 2];

    aValue = Number(aValue);

    for (var i = 0; i < scaleValues.length; i++) {
      if (aValue == scaleValues[i]) {
        this.mScaleCombobox.selectedIndex = i;
        return;
      }
    }
    this.mScaleCombobox.value = "Custom";
  }

  scale(aValue) {
    var settings = PrintUtils.getPrintSettings();
    if (aValue == "ShrinkToFit") {
      if (!settings.shrinkToFit) {
        settings.shrinkToFit = true;
        this.savePrintSettings(settings, settings.kInitSaveShrinkToFit | settings.kInitSaveScaling);
        PrintUtils.printPreview();
      }
      return;
    }

    if (aValue == "Custom") {
      aValue = this.promptForScaleValue(settings.scaling * 100.0);
      if (aValue >= 10) {
        aValue /= 100.0;
      } else {
        if (this.mScaleCombobox.hasAttribute("lastValidInx")) {
          this.mScaleCombobox.selectedIndex = this.mScaleCombobox.getAttribute("lastValidInx");
        }
        return;
      }
    }

    this.setScaleCombobox(aValue);
    this.mScaleCombobox.setAttribute("lastValidInx", this.mScaleCombobox.selectedIndex);

    if (settings.scaling != aValue || settings.shrinkToFit) {
      settings.shrinkToFit = false;
      settings.scaling = aValue;
      this.savePrintSettings(settings, settings.kInitSaveShrinkToFit | settings.kInitSaveScaling);
      PrintUtils.printPreview();
    }
  }

  orient(aOrientation) {
    const kIPrintSettings = Ci.nsIPrintSettings;
    var orientValue = (aOrientation == "portrait") ? kIPrintSettings.kPortraitOrientation :
      kIPrintSettings.kLandscapeOrientation;
    var settings = PrintUtils.getPrintSettings();
    if (settings.orientation != orientValue) {
      settings.orientation = orientValue;
      this.savePrintSettings(settings, settings.kInitSaveOrientation);
      PrintUtils.printPreview();
    }
  }

  simplify() {
    PrintUtils.setSimplifiedMode(this.mSimplifyPageCheckbox.checked);
    PrintUtils.printPreview();
  }

  enableSimplifyPage() {
    this.mSimplifyPageNotAllowed = false;
    this.mSimplifyPageCheckbox.disabled = false;
    this.mSimplifyPageCheckbox.setAttribute("tooltiptext",
      this.mSimplifyPageCheckbox.getAttribute("tooltiptext-enabled"));
  }

  disableSimplifyPage() {
    this.mSimplifyPageNotAllowed = true;
    this.mSimplifyPageCheckbox.disabled = true;
    this.mSimplifyPageCheckbox.setAttribute("tooltiptext",
      this.mSimplifyPageCheckbox.getAttribute("tooltiptext-disabled"));
  }

  updateToolbar() {
    var settings = PrintUtils.getPrintSettings();

    var isPortrait = settings.orientation == Ci.nsIPrintSettings.kPortraitOrientation;

    this.mPortaitButton.checked = isPortrait;
    this.mLandscapeButton.checked = !isPortrait;

    if (settings.shrinkToFit) {
      this.mScaleCombobox.value = "ShrinkToFit";
    } else {
      this.setScaleCombobox(settings.scaling);
    }

    this.mPageTextBox.value = 1;
  }

  savePrintSettings(settings, flags) {
    var PSSVC = Cc["@mozilla.org/gfx/printsettings-service;1"]
      .getService(Ci.nsIPrintSettingsService);
    PSSVC.savePrintSettingsToPrefs(settings, true, flags);
  }

  /**
   * nsIMessageListener
   */
  receiveMessage(message) {
    if (message.name == "Printing:Preview:UpdatePageCount") {
      let numPages = message.data.numPages;
      this.mTotalPages.value = numPages;
      this.mPageTextBox.max = numPages;
    }
  }

  _setupEventListeners() {

  }
}