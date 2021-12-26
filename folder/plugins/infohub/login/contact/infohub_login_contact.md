# Infohub_Login_Contact

Here you can see your contact data. You can also change node name and note.

# The data

In the form you can see the contact data. Most fields are read only but two are open, so you can change the contents and
save. The form is called "One contact".

## Node

Write any text you want. The data in this field is used for server to server communication.

You as a browser client will always communicate with the node "server". All your messages will go to that node.

If this contact information were used on a server then the server can send messages to different nodes. The server would
need to have a good unique node name it can send messages to.

## Note

Here you can write anything you want.

## Save

You can save your changes in node and note with this button.

## Domain address

The domain address to your server. This is the full URL to the server you got the contact information from. This is the
place on internet where the messages will go to.

## User name

This is you on the server.

The username is a Hub-UUID and is constructed by the current timestamp since EPOC, a colon and then a random string. You
can read more about [Hub-UUID](plugin,infohub_uuid).

## Shared secret

You share this secret with the server. Do not reveal it with anyone else. Protect it to your best effort.

The shared secret is 2048 byte long. You can scramble the shared secret with a password.
See [password](plugin,infohub_log in_password).

## Checksum

The checksum is calculated every time your contact data are displayed. The checksum is a CRC32 of the domain address +
username + shared secret.

You can use the checksum to quickly see if your contact information have been manipulated.

If you set a password and store that password in a safe place then you can also write down the checksum, so you know that
this password fit this contact information.

## Allowed plugins

Here you see a list with all plugins that you can send messages to on the server. You do not need to worry about that,
it is your browser that need this information.

# License

This documentation is copyright (C) 2019 Peter Lembke. Permission is granted to copy, distribute and/or modify this
document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free
Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. You should have received
a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2019-09-14 by Peter Lembke Updated 2019-09-14 by Peter Lembke
