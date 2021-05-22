# Infohub Encrypt PGP

Use OpenPGP to encrypt and decrypt your data on the client or on the server.

# Introduction

# Encrypt

Provide a text and a password. Encrypt will return the encrypted text.

```
$default = array(
    'text' => 'Hello World',
    'password' => 'infohub2010',
);
```

# Decrypt

Provide an encrypted text and a password. Decrypt will return the text.

```
$default = array(
    'encrypted_text' => '',
    'password' => ''
);
```

# PHP version (server)

Depends on you installing the PHP plugin gnupg. Read more
here: [PHP](https://stackoverflow.com/questions/15969740/encrypt-files-using-pgp-in-php)

# Javascript version (browser)

The [Javascript](https://openpgpjs.org/openpgpjs/doc/#encrypt-and-decrypt-uint8array-data-with-a-password) version has
an embedded pgp library.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2020-02-15 by Peter Lembke  
Updated 2020-02-15 by Peter Lembke  
