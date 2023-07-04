# InfoHub Tree Encrypt

Encrypt/decrypt the data locally in the browser. You give an encryption key.

## Introduction

The plain text comes in here. We compress with gzip and then encrypt with pgp. The encrypted text are returned.

The encrypted text comes in here. We decrypt with PGP and then decompress with gzip. The plain text are returned.

## GUI

Button "Import key" where you can select your encryption key file. The data in the file will only be stored in memory in
this plugin.

You will see an indicator on the button that show if there is an encryption key in memory or not.

Button "Forget key". Removes all the key from memory. They will also vanish if you refresh the screen.

Button "Create key". Will download a json file with a key in it. Keep it safe. You need to import the key.

## Functions

These functions are only used by infohub_tree_storage

* encrypt -
* decrypt -

## License

This documentation is copyright (C) 2020 Peter Lembke. Permission is granted to copy, distribute and/or modify this
document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free
Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. You should have received
a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Created 2020-07-25 by Peter Lembke  
Updated 2021-02-12 by Peter Lembke
