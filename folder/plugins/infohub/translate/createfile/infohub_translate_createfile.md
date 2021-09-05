# Infohub Translate Create File

Here you can select a plugin and get one translation file downloaded. You get the english file.

You can then translate the contents of the file in Google Translate or Bing Translate.

The file contains all phrases for the level 1 plugin and all of its children.

## GUI

* Button "Refresh list" refreshes the plugin list we have locally.
* Select one of the plugins.
* Button "Create file" will download the file.

## Example data

This is how the file can look like:

```
{
    "version": {
        "date": "2021-08-12 12:32:59",
        "plugin": "infohub_login",
        "data_checksum": "fbda54d22174541e3330850c45ad7f5f",
        "language": "en",
        "country": "GB",
        "file_type": "translate_file"
    },
    "data": {
        "infohub_login": {
            "INSTRUCTIONS_KEY": "Instructions",
            "USE_THE_MENU._KEY": "Use the menu.",
            "WHAT_IS_THIS?_KEY": "What is this?"
        },
        "infohub_login_contact": {
            "ONE_CONTACT_KEY": "One contact",
            "THIS_IS_THE_DATA_FORM_FOR_ONE_CONTACT_KEY": "This is the data form for one contact",
            "NODE_KEY": "Node",
            "ANY_TEXT_YOU_WANT_KEY": "Any text you want",
            "NOTE_KEY": "Note",
            "SAVE_KEY": "Save",
            "DOMAIN_ADDRESS_KEY": "Domain address",
            "THE_DOMAIN_ADDRESS_TO_YOUR_SERVER_KEY": "The domain address to your server",
            "USER_NAME_KEY": "User name",
            "THIS_IS_YOU_ON_THE_SERVER_KEY": "This is you on the server",
            "SHARED_SECRET_KEY": "Shared secret",
            "YOU_SHARE_THIS_SECRET_WITH_THE_SERVER_KEY": "You share this secret with the server",
            "CHECKSUM_KEY": "Checksum",
            "CHECKSUM_OF_DOMAIN_ADDRESS_+_USER_NAME_+_SHARED_SECRET._KEY": "Checksum of domain address + user name + shared secret.",
            "ALLOWED_SERVER_PLUGINS_KEY": "Allowed server plugins",
            "LIST_WITH_ALL_SERVER_PLUGIN_NAMES_YOU_CAN_SEND_MESSAGES_TO_ON_THE_REMOTE_NODE_KEY": "List with all server plugin names you can send messages to on the remote node"
        },
        "infohub_login_export": {
            "EXPORT_CONTACT_KEY": "Export contact",
            "HERE_YOU_CAN_EXPORT_THE_CONTACT_DATA_KEY": "Here you can export the contact data",
            "EXPORT_KEY": "Export"
        },
        "infohub_login_forget": {
            "FORGET_CONTACT_KEY": "Forget contact",
            "HERE_YOU_CAN_LET_THE_BROWSER_FORGET_THE_CONTACT_DATA._YOU_CAN_ALWAYS_IMPORT_YOUR_FILE_AGAIN._KEY": "Here you can let the browser forget the contact data. You can always import your file again.",
            "FORGET_KEY": "Forget"
        },
        "infohub_login_import": {
            "IMPORT_KEY": "Import",
            "IMPORT_THE_CONTACT_INFORMATION_FROM_FILE_KEY": "Import the contact information from file",
            "SELECT_FILE_KEY": "Select file"
        },
        "infohub_login_login": {
            "LOGIN_KEY": "Login",
            "HERE_YOU_CAN_USE_THE_CONTACT_DATA_YOU_IMPORTED_AND_LOGIN_TO_THE_SERVER_KEY": "Here you can use the contact data you imported and login to the server",
            "PASSWORD_KEY": "Password",
            "THE_PASSWORD_YOU_NEED_TO_DECODE_THE_SHARED_SECRET_KEY": "The password you need to decode the shared secret",
            "LOGIN_RESULT_KEY": "Login result",
            "RELOAD_AFTER_LOGIN_KEY": "Reload after login",
            "YOU_ARE_ALREADY_LOGGED_IN_KEY": "You are already logged in",
            "MISSING_USER_NAME_KEY": "Missing user name",
            "MISSING_RANDOM_CODE_KEY": "Missing random code",
            "THE_ANSWER_FROM_THE_SERVER_TOOK_TOO_LONG_TIME._I_WILL_ABANDON_THE_LOGIN_ATTEMPT_KEY": "The answer from the server took too long time. I will abandon the login attempt",
            "FAILED_TO_LOGIN_KEY": "Failed to login",
            "SUCCESS_LOGGING_IN_KEY": "Success logging in",
            "THE_RANDOM_CODE_DO_NOT_HAVE_THE_CORRECT_LENGTH_KEY": "The random code do not have the correct length",
            "UNLIKELY_THAT_THE_TOTAL_AVERAGE_HAS_NO_DECIMALS_KEY": "Unlikely that the total average has no decimals",
            "UNLIKELY_THAT_THE_AVERAGE_IS_EQUAL_TO_THE_TOTAL_AVERAGE_KEY": "Unlikely that the average is equal to the total average",
            "THESE_SIMPLE_TESTS_SHOW_THAT_THE_RANDOM_CODE_AT_LEAST_IS_NOT_A_FLATLINE_OF_NUMBERS._KEY": "These simple tests show that the random code at least is not a flatline of numbers."
        },
        "infohub_login_logout": {
            "LOGOUT_KEY": "Logout",
            "HERE_YOU_CAN_LOGOUT_FROM_THE_SERVER_KEY": "Here you can logout from the server",
            "IF_SUCCESSFUL_THEN_THE_LOGIN_PAGE_SHOWS_KEY": "If successful then the login page shows",
            "LOGOUT_RESULT_KEY": "Logout result",
            "FAILED_TO_LOGOUT_KEY": "Failed to logout",
            "SUCCESS_LOGGING_OUT_KEY": "Success logging out"
        },
        "infohub_login_menu": {
            "MENU_KEY": "Menu",
            "IMPORT_CONTACT_DATA_KEY": "Import contact data",
            "LOGIN_KEY": "Login",
            "SET_PASSWORD_KEY": "Set password",
            "EXPORT_CONTACT_DATA_KEY": "Export contact data",
            "LOGOUT_KEY": "Logout",
            "FORGET_CONTACT_KEY": "Forget contact"
        },
        "infohub_login_password": {
            "SET_PASSWORD_KEY": "Set password",
            "WHEN_YOU_SET_YOUR_LOCAL_PASSWORD_YOU_SCRAMBLE_THE_SHARED_SECRET_SO_THAT_IT_REQUIRE_YOUR_PASSWORD_TO_WORK_KEY": "When you set your local password you scramble the shared secret so that it require your password to work",
            "CURRENT_PASSWORD_KEY": "Current password",
            "LEAVE_BLANK_IF_YOU_HAVE_NONE_KEY": "Leave blank if you have none",
            "NEW_PASSWORD_KEY": "New password",
            "LEAVE_BLANK_IF_YOU_WANT_TO_REMOVE_THE_PASSWORD_KEY": "Leave blank if you want to remove the password",
            "CHANGE_PASSWORD_KEY": "Change password"
        },
        "infohub_login_standalone": {
            "LOGIN_KEY": "Login",
            "SELECT_FILE_KEY": "Select file",
            "PASSWORD_KEY": "Password",
            "DOWNLOAD_DEMO_ACCOUNT_KEY": "Download demo account",
            "LOGIN_RESULT_KEY": "Login result",
            "MORE_KEY": "More",
            "CURRENT_URL_KEY": "Current url",
            "REFRESH_PAGE_KEY": "Refresh page"
        }
    }
}
```

## Language codes

Copy the en.json file to the language code you want.
The language code used is the two letter codes listed here [ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php).
Search for a language. For example "swedish" and get the code "sv". Copy en.json to sv.json

You can now translate the sv.json manually or use a translation service. 

## Translate the file

You can copy the text in `data` and paste it into [Google translate](https://translate.google.se/?sl=en&tl=sv&op=translate) or in [Bind translate](https://www.bing.com/translator/).

Google allows 5000 characters (better). Bing allow 1000 charcters.
Google modify some keys and adds spaces around + and ?. Bing do not touch the keys (better).

The result might not be a valid JSON data. I use PHP Storm to review the result. It says if it is a valid json and marks the faulty rows on the right side. 

If the file is really long then you need to translate parts of the file and put together the parts.

## License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Since 2020-12-15 by Peter Lembke  
Updated 2021-08-15 by Peter Lembke
