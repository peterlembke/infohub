# Infohub_Login

Infohub_Login allow you to login to another node. The PHP server version make sure the login is done without revealing
secrets.  
The JS version has the same features as the PHP version and has a graphical user interface (GUI) where you can enter
data that will be used in the login.

## First login version

The first thing you see when you start Infohub is a version of the login plugin with a reduced interface. It is the same
plugin rendered with fewer features. You can import a login file, enter a password and login.

### Information text

You can also present an information text what this site is about. See folder `start_page_text`. Here you have en.md,
sv.md, es.md markdown text files.

You can copy the folder to `folder/file/infohub_login` and copy the configuration file `infohub_login.json`
to `folder/config` and modify the folder to "file". Now you can add more languages.

The best language are picked from the users preferences.

Observe that this feature is not bound to a domain. It is bound to an installation. I might change that in the future.

## Client version

This is what you see when you start the "Login" plugin in your browser. With the [menu](plugin,infohub_login_menu) you
can navigate to different features of the plugin.

In the [One contact](plugin,infohub_login_contact) form you can see your contact information.

When you [login](plugin,infohub_login_login) your browser start to negotiate with the server. If all went well then you
can communicate with the server.

You can [import](plugin,infohub_login_login), [export](plugin,infohub_login_export)
, [forget](plugin,infohub_login_forget) contact data.

You can [set a password](plugin,infohub_login_password) on your shared secret.

You can also [logout](plugin,infohub_login_password) from the server.

## Server version

The server version run on the server and handle the incoming login request. The login is done in a way so both sides can
prove that they know the shared_secret without revealing the shared_secret.

You can read about this process in detail here: [login](plugin,infohub_login_login)

# License

This documentation is copyright (C) 2019 Peter Lembke. Permission is granted to copy, distribute and/or modify this
document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free
Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. You should have received
a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2018-09-14 by Peter Lembke Updated 2019-09-14 by Peter Lembke
