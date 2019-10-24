# Infohub Password
Your password generator  

# Introduction
Generates passwords for you to use. You get 30 passwords listed and can pick anyone of them or refresh the page and get another 30. If possible, use this code offline on your trusted computer.  
If you provide no parameters then you get the default values:  
    
* 30 passwords in a list
* variable length 16-64 characters
* characters from all 5 groups
    
# Parameters
password_length = length of the passwords you want. 0 (default) gives you a random length 16-64 characters.  
max_group_number = numbers of groups to include in the password.  

```
0 => 'abcdefghijklmnopqrstuvwxyz',
1 => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
2 => '0123456789',
3 => '!#%&()=?+-*:;,._',
4 => ' ',
```

Default max_group_number = 4 (0-4) Some sites do not allow spaces, then set max_group_number = 3 Some sites do not allow special chacaters, then set max_group_number = 2  

# Random numbers
PHP 5 uses mt_rand(), an OK random generator. PHP 7 uses random_int(), a better random generator  

# Examples
Here are two example links  

```
<a href="http://charzam.com/password/?length=32&max_group_number=3">32 characters, group 0-3</a>
<a href="http://charzam.com/password/?length=16&max_group_number=2">16 characters, group 0-2</a>
```

# Passwords - general caution
There is no such thing as a good password. Passwords should never be used. But we are in a world filled with passwords, and the only thing we can do is to make the passwords as secure as possible.  

* Password is personal - do not let a group share a password.
* Password is private – do not share your password
* Password is unique - Never reuse it
* Password must be hard to guess - Use a good open source password generator that you trust
* Password should be used every time - Do not let your browser remember the password.
* Keep your password in an encrypted file locally stored – Do not use password managers like LastPass.

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2017-04-02 by Peter Lembke  
Updated 2017-04-02 by Peter Lembke  
