# Infohub Encrypt
Use OpenPGP to encrypt and decrypt your data on the client or on the server.   

# Introduction
There are for now only one use case for encryption and that is the client encrypting data that are to be stored in local Storage or are transported and stored on the server.

Encryption is complicated business. I have investigated the built in methods in the browsers and the build in methods in PHP. It is a jungle and if you do anything wrong then the encryption is worthless.

You also have to determine if you want a simple password or a two key solution with one public and one private key. And then if you want the client and server to encrypt/decrypt each others packages then it will get even more complicated.

It would be nice if PHP and the browsers had solutions that were easy to use for none experts.

From that background I have returned to what I trust and have used before: Pretty good privacy. PGP. PGP exist in [PHP](https://stackoverflow.com/questions/15969740/encrypt-files-using-pgp-in-php) and in [Javascript](https://openpgpjs.org/openpgpjs/doc/#encrypt-and-decrypt-uint8array-data-with-a-password).

# Password
I will use a single point encrypt/decrypt so a single password will do nicely.
The server and client will not exchange encrypted data.

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
Depends on you installing the PHP plugin gnupg. Read more here: [PHP](https://stackoverflow.com/questions/15969740/encrypt-files-using-pgp-in-php) 

# Javascript version (browser)
The [Javascript](https://openpgpjs.org/openpgpjs/doc/#encrypt-and-decrypt-uint8array-data-with-a-password) version has an embedded pgp library.

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2018-09-25 by Peter Lembke  
Updated 2019-11-19 by Peter Lembke  
