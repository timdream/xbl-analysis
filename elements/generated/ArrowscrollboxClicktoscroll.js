class FirefoxArrowscrollboxClicktoscroll extends FirefoxArrowscrollbox {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:toolbarbutton class="scrollbutton-up" inherits="orient,collapsed=notoverflowing,disabled=scrolledtostart" anonid="scrollbutton-up" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(-1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(-1);" onmouseout="_pauseScroll();"></xul:toolbarbutton>
      <xul:spacer class="arrowscrollbox-overflow-start-indicator" inherits="collapsed=scrolledtostart"></xul:spacer>
      <xul:scrollbox class="arrowscrollbox-scrollbox" anonid="scrollbox" flex="1" inherits="orient,align,pack,dir,smoothscroll">
        <children></children>
      </xul:scrollbox>
      <xul:spacer class="arrowscrollbox-overflow-end-indicator" inherits="collapsed=scrolledtoend"></xul:spacer>
      <xul:toolbarbutton class="scrollbutton-down" inherits="orient,collapsed=notoverflowing,disabled=scrolledtoend" anonid="scrollbutton-down" onclick="_distanceScroll(event);" onmousedown="if (event.button == 0) _startScroll(1);" onmouseup="if (event.button == 0) _stopScroll();" onmouseover="_continueScroll(1);" onmouseout="_pauseScroll();"></xul:toolbarbutton>
    `;
    this._scrollIndex = 0;

    this._scrollDelay = 150;

    this._arrowScrollAnim = {
      scrollbox: this,
      requestHandle: 0,
      /* 0 indicates there is no pending request */
      start: function arrowSmoothScroll_start() {
        this.lastFrameTime = window.performance.now();
        if (!this.requestHandle)
          this.requestHandle = window.requestAnimationFrame(this.sample.bind(this));
      },
      stop: function arrowSmoothScroll_stop() {
        window.cancelAnimationFrame(this.requestHandle);
        this.requestHandle = 0;
      },
      sample: function arrowSmoothScroll_handleEvent(timeStamp) {
        const scrollIndex = this.scrollbox._scrollIndex;
        const timePassed = timeStamp - this.lastFrameTime;
        this.lastFrameTime = timeStamp;

        const scrollDelta = 0.5 * timePassed * scrollIndex;
        this.scrollbox.scrollByPixels(scrollDelta, true);
        this.requestHandle = window.requestAnimationFrame(this.sample.bind(this));
      }
    };

    this._scrollDelay =
      this._prefBranch.getIntPref("toolkit.scrollbox.clickToScroll.scrollDelay",
        this._scrollDelay);

    this._setupEventListeners();
  }

  notify(aTimer) {
    if (!document)
      aTimer.cancel();

    this.scrollByIndex(this._scrollIndex);
  }

  _startScroll(index) {
    if (this._isRTLScrollbox)
      index *= -1;
    this._scrollIndex = index;
    this._mousedown = true;

    if (this.smoothScroll) {
      this._arrowScrollAnim.start();
      return;
    }

    if (!this._scrollTimer)
      this._scrollTimer =
      Cc["@mozilla.org/timer;1"]
      .createInstance(Ci.nsITimer);
    else
      this._scrollTimer.cancel();

    this._scrollTimer.initWithCallback(this, this._scrollDelay,
      this._scrollTimer.TYPE_REPEATING_SLACK);
    this.notify(this._scrollTimer);
  }

  _stopScroll() {
    if (this._scrollTimer)
      this._scrollTimer.cancel();
    this._mousedown = false;
    if (!this._scrollIndex || !this.smoothScroll)
      return;

    this.scrollByIndex(this._scrollIndex);
    this._scrollIndex = 0;

    this._arrowScrollAnim.stop();
  }

  _pauseScroll() {
    if (this._mousedown) {
      this._stopScroll();
      this._mousedown = true;
      document.addEventListener("mouseup", this);
      document.addEventListener("blur", this, true);
    }
  }

  _continueScroll(index) {
    if (this._mousedown)
      this._startScroll(index);
  }

  handleEvent(aEvent) {
    if (aEvent.type == "mouseup" ||
      aEvent.type == "blur" && aEvent.target == document) {
      this._mousedown = false;
      document.removeEventListener("mouseup", this);
      document.removeEventListener("blur", this, true);
    }
  }

  _distanceScroll(aEvent) {
    if (aEvent.detail < 2 || aEvent.detail > 3)
      return;

    var scrollBack = (aEvent.originalTarget == this._scrollButtonUp);
    var scrollLeftOrUp = this._isRTLScrollbox ? !scrollBack : scrollBack;
    var targetElement;

    if (aEvent.detail == 2) {
      // scroll by the size of the scrollbox
      let [start, end] = this._startEndProps;
      let x;
      if (scrollLeftOrUp)
        x = this.scrollClientRect[start] - this.scrollClientSize;
      else
        x = this.scrollClientRect[end] + this.scrollClientSize;
      targetElement = this._elementFromPoint(x, scrollLeftOrUp ? -1 : 1);

      // the next partly-hidden element will become fully visible,
      // so don't scroll too far
      if (targetElement)
        targetElement = scrollBack ?
        targetElement.nextSibling :
        targetElement.previousSibling;
    }

    if (!targetElement) {
      // scroll to the first resp. last element
      let elements = this._getScrollableElements();
      targetElement = scrollBack ?
        elements[0] :
        elements[elements.length - 1];
    }

    this.ensureElementIsVisible(targetElement);
  }

  disconnectedCallback() {
    // Release timer to avoid reference cycles.
    if (this._scrollTimer) {
      this._scrollTimer.cancel();
      this._scrollTimer = null;
    }
  }

  _setupEventListeners() {

  }
}