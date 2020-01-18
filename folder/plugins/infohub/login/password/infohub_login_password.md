# Infohub_Login_Password
Here you can set a password on your shared secret. This is an extra security in case someone get hold of your contact information.
The password will scramble the shared secret. Anyone that try to guess your password need to try to login for each try. The server will be suspicious and will make it harder to login.

## Set password
When you set your local password you scramble the shared secret so that it require your password to work.

This "Set password" feature show you a box for the current password and the new password.  

* If you have no current password then leave that box blank.
* If you want to remove the password from the shared_secret then write your current password and leave the new password blank.

You can write anything you want in the password boxes. 

If you lose your password then there is no way to reconstruct your shared_secret.

You can store a shared_secret that has no password or write down your password and put it in your physical vault.

# How the password are set
Each character in the password will be added to the shared_secret. The password is probably shorter than the shared_secret som the password will be repeated over and over. 

# License
This documentation is copyright (C) 2019 Peter Lembke.
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2019-09-02 by Peter Lembke
Updated 2019-09-14 by Peter Lembke
