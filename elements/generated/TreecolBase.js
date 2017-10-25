class FirefoxTreecolBase extends FirefoxTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

    this.parentNode.parentNode._columnsDirty = true;

    this.addEventListener("mousedown", event => {
      if (this.parentNode.parentNode.enableColumnDrag) {
        var xulns =
          "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        var cols = this.parentNode.getElementsByTagNameNS(xulns, "treecol");

        // only start column drag operation if there are at least 2 visible columns
        var visible = 0;
        for (var i = 0; i < cols.length; ++i)
          if (cols[i].boxObject.width > 0) ++visible;

        if (visible > 1) {
          window.addEventListener("mousemove", this._onDragMouseMove, true);
          window.addEventListener("mouseup", this._onDragMouseUp, true);
          document.treecolDragging = this;
          this.mDragGesturing = true;
          this.mStartDragX = event.clientX;
          this.mStartDragY = event.clientY;
        }
      }
    });

    this.addEventListener("click", event => {
      if (event.target != event.originalTarget) return;

      // On Windows multiple clicking on tree columns only cycles one time
      // every 2 clicks.
      if (/Win/.test(navigator.platform) && event.detail % 2 == 0) return;

      var tree = this.parentNode.parentNode;
      if (tree.columns) {
        tree.view.cycleHeader(tree.columns.getColumnFor(this));
      }
    });
  }

  set ordinal(val) {
    this.setAttribute("ordinal", val);
    return val;
  }

  get ordinal() {
    var val = this.getAttribute("ordinal");
    if (val == "") return "1";

    return "" + (val == "0" ? 0 : parseInt(val));
  }

  get _previousVisibleColumn() {
    var sib = this.boxObject.previousSibling;
    while (sib) {
      if (
        sib.localName == "treecol" &&
        sib.boxObject.width > 0 &&
        sib.parentNode == this.parentNode
      )
        return sib;
      sib = sib.boxObject.previousSibling;
    }
    return null;
  }
  _onDragMouseMove(aEvent) {
    var col = document.treecolDragging;
    if (!col) return;

    // determine if we have moved the mouse far enough
    // to initiate a drag
    if (col.mDragGesturing) {
      if (
        Math.abs(aEvent.clientX - col.mStartDragX) < 5 &&
        Math.abs(aEvent.clientY - col.mStartDragY) < 5
      ) {
        return;
      }
      col.mDragGesturing = false;
      col.setAttribute("dragging", "true");
      window.addEventListener("click", col._onDragMouseClick, true);
    }

    var pos = {};
    var targetCol = col.parentNode.parentNode._getColumnAtX(
      aEvent.clientX,
      0.5,
      pos
    );

    // bail if we haven't mousemoved to a different column
    if (col.mTargetCol == targetCol && col.mTargetDir == pos.value) return;

    var tree = col.parentNode.parentNode;
    var sib;
    var column;
    if (col.mTargetCol) {
      // remove previous insertbefore/after attributes
      col.mTargetCol.removeAttribute("insertbefore");
      col.mTargetCol.removeAttribute("insertafter");
      column = tree.columns.getColumnFor(col.mTargetCol);
      tree.treeBoxObject.invalidateColumn(column);
      sib = col.mTargetCol._previousVisibleColumn;
      if (sib) {
        sib.removeAttribute("insertafter");
        column = tree.columns.getColumnFor(sib);
        tree.treeBoxObject.invalidateColumn(column);
      }
      col.mTargetCol = null;
      col.mTargetDir = null;
    }

    if (targetCol) {
      // set insertbefore/after attributes
      if (pos.value == "after") {
        targetCol.setAttribute("insertafter", "true");
      } else {
        targetCol.setAttribute("insertbefore", "true");
        sib = targetCol._previousVisibleColumn;
        if (sib) {
          sib.setAttribute("insertafter", "true");
          column = tree.columns.getColumnFor(sib);
          tree.treeBoxObject.invalidateColumn(column);
        }
      }
      column = tree.columns.getColumnFor(targetCol);
      tree.treeBoxObject.invalidateColumn(column);
      col.mTargetCol = targetCol;
      col.mTargetDir = pos.value;
    }
  }
  _onDragMouseUp(aEvent) {
    var col = document.treecolDragging;
    if (!col) return;

    if (!col.mDragGesturing) {
      if (col.mTargetCol) {
        // remove insertbefore/after attributes
        var before = col.mTargetCol.hasAttribute("insertbefore");
        col.mTargetCol.removeAttribute(before ? "insertbefore" : "insertafter");

        var sib = col.mTargetCol._previousVisibleColumn;
        if (before && sib) {
          sib.removeAttribute("insertafter");
        }

        // Move the column only if it will result in a different column
        // ordering
        var move = true;

        // If this is a before move and the previous visible column is
        // the same as the column we're moving, don't move
        if (before && col == sib) {
          move = false;
        } else if (!before && col == col.mTargetCol) {
          // If this is an after move and the column we're moving is
          // the same as the target column, don't move.
          move = false;
        }

        if (move) {
          col.parentNode.parentNode._reorderColumn(col, col.mTargetCol, before);
        }

        // repaint to remove lines
        col.parentNode.parentNode.treeBoxObject.invalidate();

        col.mTargetCol = null;
      }
    } else col.mDragGesturing = false;

    document.treecolDragging = null;
    col.removeAttribute("dragging");

    window.removeEventListener("mousemove", col._onDragMouseMove, true);
    window.removeEventListener("mouseup", col._onDragMouseUp, true);
    // we have to wait for the click event to fire before removing
    // cancelling handler
    var clickHandler = function(handler) {
      window.removeEventListener("click", handler, true);
    };
    window.setTimeout(clickHandler, 0, col._onDragMouseClick);
  }
  _onDragMouseClick(aEvent) {
    // prevent click event from firing after column drag and drop
    aEvent.stopPropagation();
    aEvent.preventDefault();
  }
}
customElements.define("firefox-treecol-base", FirefoxTreecolBase);
