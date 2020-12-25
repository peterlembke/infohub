# [1.2.26] - 2020-12-17

This release focus on translations. A simpler system for translations. More translations.

* [Release notes](main,release_v1_v1v2_v1v2v26)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.26)

## Added
* HUB-1083, Add Twitter to the "Read more" section on the login screen
* HUB-1096, Translate: Button to create english translation file with KEY and phrase.
* HUB-1102, Translate: Added _KEY suffix to all keys to prevents Google Translate to translate single keywords.
* HUB-1090, Login: Add more translation files: nl, fr, da, de, fi, cz, it, ru, el, et, hi, is, ja, nb, pl, pt

## Changed
* HUB-1084, start_page_text. Change five names from country code to language code and add README with code list
* HUB-1085, If user: guest ask for config language then return browser language

## Removed
* HUB-1100, Translate: Removed obsolete code
* HUB-1101, Moved _Translate to Base.js and removed it from all plugins. Improved _Translate to support both language files with phrase or key.

## Fixed
* HUB-1087, Bug in login setup_information did not give the welcome file in the browser language
* HUB-1098, Bug in infohub_tabs when calling ModifyClass
* Fixed Translate statements that has too many spaces, so the parser can find them
* HUB-1091, Start page - Test different languages. Found bugs and fixed them. 
  Recommend Brave/Chrome addition [Locale Switcher](https://chrome.google.com/webstore/detail/locale-switcher/kngfjpghaokedippaapkfihdlmmlafcc/related).
  Github [Locale Switcher](https://github.com/athyuttamre/locale-switcher)

## Tested

## Investigated
