var xmlom = require('xmlom');
var request = require('request-promise-native');

var browserFiles = [
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/browser-tabPreviews.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/pageinfo/feeds.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/pageinfo/pageInfo.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/tabbrowser.xml',
  // 'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/urlbarBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/customizableui/content/panelUI.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/customizableui/content/toolbar.xml',
  // 'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/downloads/content/download.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/menu.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/tree.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/handlers.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/siteListItem.xml',
  // 'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/search/content/search.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/translation/translation-infobar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/extensions/formautofill/content/formautofill.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/themes/linux/places/organizer.xml',
];
var toolkitFiles = [
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/autocomplete.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/browser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/button.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/checkbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/colorpicker.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimebox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimepicker.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimepopup.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/dialog.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/editor.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/expander.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/filefield.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/findbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/general.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/groupbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/listbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/menu.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/menulist.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/notification.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/numberbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/optionsDialog.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/popup.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/preferences.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/progressmeter.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/radio.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/remote-browser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/resizer.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/richlistbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scale.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scrollbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scrollbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/spinbuttons.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/splitter.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/stringbundle.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/tabbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/text.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/textbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/toolbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/toolbarbutton.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/tree.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/videocontrols.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/wizard.xml',
];
var allFiles = module.exports.files = browserFiles.concat(toolkitFiles);

module.exports.getParsedFiles = (rev) => {
  let files = allFiles;
  if (rev) {
    // Allow for revisions like 'master@{2017-09-19}'
    files = files.map(file => {
      return file.replace('/master/', `/${rev}/`);
    });
  }

  return Promise.all(files.map(file => {
    return request(file).then(body => {
      body = body.replace(/#ifdef XP_(.*)/g, '')
                .replace(/#ifndef XP_(.*)/g, '')
                .replace(/#ifdef MOZ_WIDGET_GTK/g, '')
                .replace(/#else/g, '')
                .replace(/#endif/g, '')
                .replace(/^#(.*)/gm, ''); // This one is a special case for preferences.xml which has many lines starting with #
      console.log(`requested ${file}`);
      return xmlom.parseString(body);
    });
  }));
};
