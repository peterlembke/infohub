# Infohub Darkhold

Darkhold is used when you need to collect data from many short tail messages.

Darkhold is the fourth way you can design a return message.

* normal return message
* subcall message
* normal return or subcall or empty return with short tail messages attached
* darkhold message - short tail message answers are collected and the next step will be with the answers from them all. 

# How it works

```
return $this->_Darkhold([
    'messages': $mesageArray,
    'data_back': [
        'step': 'step_full_response'
    ]
]);
```

# Possible solution

Implement in infohub_base -> cmd()

* Add message_hub_id and parent_hub_id on all short tail messages
* Register them in a class variable -> parent_hub_id -> message_hub_id -> 
  * ['waiting_for' => [], 'got' => [], 'step' => '', 'callback_function' => object ]
* Register the parent callback_function so we can call it later
* When a message comes we check for 'parent_hub_id' and 'message_hub_id',
  * If they exist in 'waiting_for' then remove them and register the 'response' in 'got'
  * If 'waiting_for' now is empty then construct a message with the data from 'got' and send it into the function
* Now the next step occur in the function and all data is available from all short tail messages

## License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Updated 2021-10-11 by Peter Lembke 
Since 2021-10-10 by Peter Lembke  
