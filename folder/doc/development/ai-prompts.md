# AI Prompts

For vibe coding.

## JS files class header

Goal: Exchange the class header for JS files in folder/plugins/
Background: I have used the GNU standard header for all JS files, 
instead I want those to be exchanged for a new header that is more suitable for InfoHub plugins.
Details:
You can see the standard header in the file plugins/infohub/tree/infohub_tree.js
Here is the new header to use:
``` 
/**
 * Note
 *
 * @package     Infohub
 * @subpackage  infohub_tree
 * @since       2025-06-22   
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
```
Find information about the plugin in function: _Version
Copy 'title' and 'note' and use as Note. 
Copy 'class_name' and use as @subpackage.
Copy 'since' and use as @since.
@package is always 'Infohub'.
@author is always 'Peter Lembke <info@infohub.se>'
@license is always 'GPL-3.0-or-later'
@copyright is always 'Copyright (C) 2010- Peter Lembke'

Steps:
* Do the change in folder/plugins/infohub/tree/infohub_tree.js and then ask me to review before continuing.
* Exchange the header on all JS files in folder/plugins/ that is not yet changed

### Result
The above prompt resulted in a carefully crafted bash file: update_headers.sh that updates the class headers in all JS files in the plugins directory.