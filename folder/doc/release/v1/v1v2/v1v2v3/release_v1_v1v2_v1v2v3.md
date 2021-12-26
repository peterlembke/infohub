# [1.2.3] - 2019-12-05

* [Release notes](main,release_v1_v1v2_v1v2v3)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.3)

## Added
- Encryption - See Infohub Tools Encrypt.
- infohub_encrypt - adds encryption methods: pgp and none. Use them with a password. encrypt + decrypt.
- Added a CHANGELOG

## Changed
- Kick out tests - Simplified them and made them into objects
- Sessions - Removed the traditional cookie session and the php session_start. Will have a new solution in the next release.
- progress - The variable are now defined and pasted into infohub_start($progress);
- infohub_render_form - Text Area - You can now paste a "value" to be shown in the text area as an initial value.
- infohub_tools - Now downloads all its children at the same call. Makes it faster to use.
- infohub_configlocal - Now downloads all its children at the same call. Makes it faster to use.
- infohub_welcome - Now has translations on all children from start

## Fixed
- cold_start - failed on Firefox. Moved the deletion of the cold_start flag to an earlier point, and now it works.
- infohub_offline.js - used variables that not all service workers have yet. Now it checks if the variable is defined.
