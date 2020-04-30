# [1.2.14] - 2020-05-
Focused on 

* [Release notes](main,release_v1v2v14)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.14)

## Aim
**Below is the aim for version 1.2.14**
To do from top to bottom:

- HUB-663 - Client: Login, standalone improvements

### First
- HUB-656 - Client: Contact, new option to set allowed client GUI plugins for a user
- HUB-623 - Server: launcher, get_full_list - Only get plugins you have rights to

### Second
- HUB-605 - Client: Infohub Session - Get allowed plugins list
- HUB-624 - Client: Check outgoing messages that I am allowed to send to those plugins

### Third
- HUB-625 - Server: Server: Response package. add messages_encoded
- HUB-600 - Server. Response package. Calculate sign_code
- HUB-626 - Server: Outgoing messages. Comply to package_type = "2020"
- HUB-627 - Client: Receive packages with type "2020"
- HUB-628 - Client: Incoming response. Verify sign_code

### Forth
- HUB-653 - Investigate what plugins is needed for Login
- HUB-622 - Server: plugin_request - guests can request from reduced list

## Added

## Changed

## Removed

## Fixed

## Tested
