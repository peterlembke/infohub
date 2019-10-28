# Infohub Translate Create Files
Here you can select a plugin and get two files downloaded.
First file is the original phrases on the left side and a code on the right side. 
Second file is the code on the right side and the phrases on the right side. 
You can translate the second file in Google Translate and then use "Merge files" to put the two files together.

The files contain all phrases for the level 1 plugin and all of its children.

## GUI
* Button "Refresh list" refreshes the plugin list we have locally. 
* Select one of the plugins.
* Button "Create files" will download the two files.

## Example data
This is how the key file can look like:
```
{
    "version": {
        "date": "2019-10-24 06:15:30",
        "plugin": "infohub_doc",
        "data_checksum": "01a94cfe595f7182dd0574670fe0e844",
        "language": "",
        "country": "",
        "file_type": "key_file"
    },
    "data": {
        "infohub_doc_document": {
            "Document": "A0",
            "Here you will see the document": "A1"
        },
        "infohub_doc_index": {
            "Refresh index": "A2",
            "Index": "A3"
        },
        "infohub_doc_navigate": {
            "Refresh navigate": "A4",
            "Navigation": "A5"
        },
        "infohub_doc_visited": {
            "Refresh visited": "A6"
        }
    }
}
```

This is how the file you can translate can look like:
```
{
    "version": {
        "date": "2019-10-24 06:15:30",
        "plugin": "infohub_doc",
        "data_checksum": "01a94cfe595f7182dd0574670fe0e844",
        "language": "",
        "country": "",
        "file_type": "translate_file"
    },
    "data": {
        "infohub_doc_document": {
            "A0": "Document",
            "A1": "Here you will see the document"
        },
        "infohub_doc_index": {
            "A2": "Refresh index",
            "A3": "Index"
        },
        "infohub_doc_navigate": {
            "A4": "Refresh navigate",
            "A5": "Navigation"
        },
        "infohub_doc_visited": {
            "A6": "Refresh visited"
        }
    }
}
```
This file can be pasted to Google Translate or translated manually.
If the file is really long then you need to translate parts of the file and put together the parts.

Next tool would be to merge the two files into the final translation file.

## License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer
Since 2019-09-28 by Peter Lembke  
Updated 2019-10-26 by Peter Lembke
