# Translate

Translations are important if you want to reach all people that do not speak english.  
You can see more [here](https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers).

On [Wikipedia - Language codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) you have a list with languages and their two characters letter code. 

## InfoHub translations

All strings in all code call the `_Translate()` function. That makes it easy to find all strings and translate them.

## InfoHub languages

With the help of [LibreTranslate](https://libretranslate.com/) I can automatically translate InfoHub to these languages. (2021-09-02)

* en - English
* ar - Arabic
* zh - Chinese
* nl - Dutch
* fr - French
* de - German
* hi - Hindi
* id - Indonesian
* ga - Irish
* it - Italian
* ja - Japanese
* ko - Korean
* pl - Polish
* pt - Portuguese
* ru - Russian
* es - Spanish
* tr - Turkish
* uk - Ukrainian
* vi - Vietnamese

More languages are probably [on the way of getting supported](https://github.com/argosopentech/argos-translate/discussions/91) in LibreTranslate, and then InfoHub will support them too.

## InfoHub extra language

LibreTranslate do [not yet support Swedish](https://github.com/argosopentech/argos-translate/discussions/91). 
I will use Google Translate and Microsoft Translate and my self to translate all plugins to Swedish.

## Country specific

Note that the language codes is for the language and not for a specific country.  
It is possible to have country specific translation files. You can read more [here](plugin,infohub_translate).

For example. My browser is in Swedish and my InfoHub language config might look like this

* sv-se, sv, en-gb, en

Reading from left to right. If a string is missing in one translation file then the next file in order might have it.

# License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2021-08-29 by Peter Lembke  
Updated 2021-09-02 by Peter Lembke  
