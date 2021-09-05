# Infohub Translate Validate

Since we do manual work on translation files they might accidentally get structural issues.  
This validator will check that the translation file is valid.

## GUI

* Button "Refresh list" refreshes the plugin list we have locally.
* Select one or more plugins.
* Button "Validate" will ask the server to validate all translation files in the selected plugins.

## Validation rules

* Is it a valid JSON? - If not then you get a URL to an online JSON validation tool to find the issue
* Does it have spaces in any key?
* Does it have the expected properties? `version`, `launcher`, `data`
* Does `version` have the expected properties? And values?
* Does `launcher` have the expected properties?
* Does `data` have valid plugin names?

If we validate some other language than `en` then we compare with en.json:

* List plugin names that only exist in en.json
* List plugin names that do not exist in en.json
* List keys that only exist in en.json
* List keys that do not exist in en.json

## License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Since 2021-08-15 by Peter Lembke  
Updated 2021-08-15 by Peter Lembke
