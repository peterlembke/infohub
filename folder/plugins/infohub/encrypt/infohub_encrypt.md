# Infohub Encrypt
You can encrypt/decrypt your data.  

# Introduction
You can create a random encryption key and encrypt your data (make it unreadable). Then you can store the data in the database, and keep the key separate and secret. If someone steal the database then the data is encrypted and they will have some trouble decoding it.  
With encryption you also have some protection against data manipulation where someone edit your data directly in the database to avoid any security you have.  

# Encryption Key
Encryption keys are created with function create_encryption_key. Parameter: length_in_bytes  
You will get a binary key back.  

# Get available options
With function get_available_options you get an options list with all available encryption options, excluded some that are considered unsecure.  

# is_method_valid
With function is_method_valid and the parameter: method (string) you can check if the method is valid for usage.  

# Encrypt
With this function: encrypt, you can encrypt a string. You provide an encryption key, the name of the encryption method, and the text you want to encrypt.  

```
$default = array(
    'plain_text' => 'Hello World',
    'encryption_key' => 'infohub2010',
    'method' => 'AES-128-CBC'
);
```

# Decrypt
With this function: decrypt, you can decrypt a string. You provide the encryption_key, the encrypted text, the name of the encryption method.  

```
$default = array(
    'encrypted_text' => '', // Base 64 encoded cipher text
    'encryption_key' => 'infohub2010',
    'method' => 'AES-128-CBC'
);
```

# PHP version
PHP have built in encryption and have a lot of methods ready to use. The PHP version of the plugin works well.  
The PHP version run on the server. Today the plugin uses an encryption key, so the plugin is suitable for encrypting data before storing in the database. It is not suitable for data traffic.  

# Javascript version
Javascript are about to get some basic encryption but the support in different browsers are fragmented.  
A substitute for the native support is to use an encryption library. Today the plugin do not work at all.  
The aim is to get some encryption methods to work. Preferable the ones that are native in the browser.  

# Single key
Methods that use a single encryption key are suitable for situations where you do not have to share the key. One example is to encrypt before you store the data in a database. Then you can decrypt the data when you need it.  
Both the client and the server have storage. That can benefit from encryption.  

# Public Private key
There are methods that allow you to create a private and a public key. You produce the key pair and you share the public key with anyone. When you send data you encrypt the message with the receivers public key and sign with your key. The receiver can then verify that the message comes from you and need the private key to decrypt the message.  
This kind of encryption is suitable for communication. Infohub will have that in the future.  

# Encryption
All encryption can be broken, but it takes time and computer power. The encryption method describe how the data should be handled. And the method can also be run backwards to get the plain text back.  
Encryption methods that take very little time and computer power to crack, they are considered weak.  
You can very well invent your own encryption method. The security of your encryption method should not relay on that your code is secret. You should be able to go public with your code.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2018-09-25 by Peter Lembke  
Updated 2018-09-25 by Peter Lembke  
