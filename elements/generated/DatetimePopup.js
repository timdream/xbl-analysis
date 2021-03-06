class FirefoxDatetimePopup extends FirefoxArrowpanel {
  connectedCallback() {
    super.connectedCallback()

    this.TIME_PICKER_WIDTH = "12em";

    this.TIME_PICKER_HEIGHT = "21em";

    this.DATE_PICKER_WIDTH = "23.1em";

    this.DATE_PICKER_HEIGHT = "20.7em";

    this.mozIntl = Cc["@mozilla.org/mozintl;1"]
      .getService(Ci.mozIMozIntl);
    // Notify DateTimePickerHelper.jsm that binding is ready.
    this.dispatchEvent(new CustomEvent("DateTimePickerBindingReady"));

    this._setupEventListeners();
  }

  get dateTimePopupFrame() {
    let frame = this.querySelector("#dateTimePopupFrame");
    if (!frame) {
      frame = this.ownerDocument.createElement("iframe");
      frame.id = "dateTimePopupFrame";
      this.appendChild(frame);
    }
    return frame;
  }

  openPicker(type, anchor, detail) {
    this.type = type;
    this.pickerState = {};
    // TODO: Resize picker according to content zoom level
    this.style.fontSize = "10px";
    switch (type) {
      case "time":
        {
          this.detail = detail;
          this.dateTimePopupFrame.addEventListener("load", this, true);
          this.dateTimePopupFrame.setAttribute("src", "chrome://global/content/timepicker.xhtml");
          this.dateTimePopupFrame.style.width = this.TIME_PICKER_WIDTH;
          this.dateTimePopupFrame.style.height = this.TIME_PICKER_HEIGHT;
          break;
        }
      case "date":
        {
          this.detail = detail;
          this.dateTimePopupFrame.addEventListener("load", this, true);
          this.dateTimePopupFrame.setAttribute("src", "chrome://global/content/datepicker.xhtml");
          this.dateTimePopupFrame.style.width = this.DATE_PICKER_WIDTH;
          this.dateTimePopupFrame.style.height = this.DATE_PICKER_HEIGHT;
          break;
        }
    }
    this.hidden = false;
    this.openPopup(anchor, "after_start", 0, 0);
  }

  closePicker() {
    this.setInputBoxValue(true);
    this.pickerState = {};
    this.type = undefined;
    this.dateTimePopupFrame.removeEventListener("load", this, true);
    this.dateTimePopupFrame.contentDocument.removeEventListener("message", this);
    this.dateTimePopupFrame.setAttribute("src", "");
    this.hidden = true;
  }

  setPopupValue(data) {
    switch (this.type) {
      case "time":
        {
          this.postMessageToPicker({
            name: "PickerSetValue",
            detail: data.value
          });
          break;
        }
      case "date":
        {
          const { year, month, day } = data.value;
          this.postMessageToPicker({
            name: "PickerSetValue",
            detail: {
              year,
              // Month value from input box starts from 1 instead of 0
              month: month == undefined ? undefined : month - 1,
              day
            }
          });
          break;
        }
    }
  }

  initPicker(detail) {
    // TODO: When bug 1376616 lands, replace this.setGregorian with
    //       mozIntl.Locale for setting calendar to Gregorian
    const locale = this.setGregorian(Services.locale.getAppLocaleAsBCP47());
    const dir = this.mozIntl.getLocaleInfo(locale).direction;

    switch (this.type) {
      case "time":
        {
          const { hour, minute } = detail.value;
          const format = detail.format || "12";

          this.postMessageToPicker({
            name: "PickerInit",
            detail: {
              hour,
              minute,
              format,
              locale,
              min: detail.min,
              max: detail.max,
              step: detail.step,
            }
          });
          break;
        }
      case "date":
        {
          const { year, month, day } = detail.value;
          const { firstDayOfWeek, weekends } =
          this.getCalendarInfo(locale);
          const monthStrings = this.getDisplayNames(
            locale, [
              "dates/gregorian/months/january",
              "dates/gregorian/months/february",
              "dates/gregorian/months/march",
              "dates/gregorian/months/april",
              "dates/gregorian/months/may",
              "dates/gregorian/months/june",
              "dates/gregorian/months/july",
              "dates/gregorian/months/august",
              "dates/gregorian/months/september",
              "dates/gregorian/months/october",
              "dates/gregorian/months/november",
              "dates/gregorian/months/december",
            ], "short");
          const weekdayStrings = this.getDisplayNames(
            locale, [
              "dates/gregorian/weekdays/sunday",
              "dates/gregorian/weekdays/monday",
              "dates/gregorian/weekdays/tuesday",
              "dates/gregorian/weekdays/wednesday",
              "dates/gregorian/weekdays/thursday",
              "dates/gregorian/weekdays/friday",
              "dates/gregorian/weekdays/saturday",
            ], "short");

          this.postMessageToPicker({
            name: "PickerInit",
            detail: {
              year,
              // Month value from input box starts from 1 instead of 0
              month: month == undefined ? undefined : month - 1,
              day,
              firstDayOfWeek,
              weekends,
              monthStrings,
              weekdayStrings,
              locale,
              dir,
              min: detail.min,
              max: detail.max,
              step: detail.step,
              stepBase: detail.stepBase,
            }
          });
          break;
        }
    }
  }

  setInputBoxValue(passAllValues) {
    /**
     * @param {Boolean} passAllValues: Pass spinner values regardless if they've been set/changed or not
     */
    switch (this.type) {
      case "time":
        {
          const { hour, minute, isHourSet, isMinuteSet, isDayPeriodSet } = this.pickerState;
          const isAnyValueSet = isHourSet || isMinuteSet || isDayPeriodSet;
          if (passAllValues && isAnyValueSet) {
            this.sendPickerValueChanged({ hour, minute });
          } else {
            this.sendPickerValueChanged({
              hour: isHourSet || isDayPeriodSet ? hour : undefined,
              minute: isMinuteSet ? minute : undefined
            });
          }
          break;
        }
      case "date":
        {
          this.sendPickerValueChanged(this.pickerState);
          break;
        }
    }
  }

  sendPickerValueChanged(value) {
    switch (this.type) {
      case "time":
        {
          this.dispatchEvent(new CustomEvent("DateTimePickerValueChanged", {
            detail: {
              hour: value.hour,
              minute: value.minute
            }
          }));
          break;
        }
      case "date":
        {
          this.dispatchEvent(new CustomEvent("DateTimePickerValueChanged", {
            detail: {
              year: value.year,
              // Month value from input box starts from 1 instead of 0
              month: value.month == undefined ? undefined : value.month + 1,
              day: value.day
            }
          }));
          break;
        }
    }
  }

  getCalendarInfo(locale) {
    const calendarInfo = this.mozIntl.getCalendarInfo(locale);

    // Day of week from calendarInfo starts from 1 as Sunday to 7 as Saturday,
    // so they need to be mapped to JavaScript convention with 0 as Sunday
    // and 6 as Saturday
    let firstDayOfWeek = calendarInfo.firstDayOfWeek - 1,
      weekendStart = calendarInfo.weekendStart - 1,
      weekendEnd = calendarInfo.weekendEnd - 1;

    let weekends = [];

    // Make sure weekendEnd is greater than weekendStart
    if (weekendEnd < weekendStart) {
      weekendEnd += 7;
    }

    // We get the weekends by incrementing weekendStart up to weekendEnd.
    // If the start and end is the same day, then weekends only has one day.
    for (let day = weekendStart; day <= weekendEnd; day++) {
      weekends.push(day % 7);
    }

    return {
      firstDayOfWeek,
      weekends
    };
  }

  getDisplayNames(locale, keys, style) {
    const displayNames = this.mozIntl.getDisplayNames(locale, { keys, style });
    return keys.map(key => displayNames.values[key]);
  }

  setGregorian(locale) {
    if (locale.match(/u-ca-/)) {
      return locale.replace(/u-ca-[^-]+/, "u-ca-gregory");
    }
    return locale + "-u-ca-gregory";
  }

  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "load":
        {
          this.initPicker(this.detail);
          this.dateTimePopupFrame.contentWindow.addEventListener("message", this);
          break;
        }
      case "message":
        {
          this.handleMessage(aEvent);
          break;
        }
    }
  }

  handleMessage(aEvent) {
    if (!this.dateTimePopupFrame.contentDocument.nodePrincipal.isSystemPrincipal) {
      return;
    }

    switch (aEvent.data.name) {
      case "PickerPopupChanged":
        {
          this.pickerState = aEvent.data.detail;
          this.setInputBoxValue();
          break;
        }
      case "ClosePopup":
        {
          this.hidePopup();
          this.closePicker();
          break;
        }
    }
  }

  postMessageToPicker(data) {
    if (this.dateTimePopupFrame.contentDocument.nodePrincipal.isSystemPrincipal) {
      this.dateTimePopupFrame.contentWindow.postMessage(data, "*");
    }
  }

  _setupEventListeners() {

  }
}