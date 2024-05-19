# InfoHub Demo Batch

Send messages and get the last returning message marked with "is_last_batch_message".

# How to use

Batch messages as usual by adding them to an array like this:

```
        $messages[] = $this->_SubCall(
            [
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ],
                'data' => [
                    'path' => 'infohub_login/login_request/' . $in['initiator_user_name'],
                    'data' => []
                ],
                'data_back' => [
                    'step' => 'step_end_response' // Batch messages require this to be set, not set to "void"
                ]
            ]
        );
```

and then return the messages like this:

```
        return $this->_BatchCall([
            'messages' => $messageArray
        ]);
```

Then we have no main message. We only have batch messages.
The last batch message that return will be marked with "data_back.is_last_batch_message" set to true and will get the call stack attached.
All other messages will have no call stack.

# License

This documentation is copyright (C) 2024 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2024-01-20 by Peter Lembke  
Updated 2024-01-20 by Peter Lembke  
