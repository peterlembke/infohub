# InfoHub Batch

Batch is used when you need to collect data from many short tail messages.

Batch is the fourth way you can design a return message.

* normal return message
* subCall message
* messages - normal return message or subCall message or empty return -> with short tail messages attached.
* batch messages - short tail messages where the last message to return have a flag that it is the last message in the batch 

## How batch messages works

You can send many messages at once. Each message will return with the value you asked for.
The last message will have a flag that it is the last message in the batch. $in.data_back.is_last_batch_message = 'true' 

```
const $messages = [
    {
        to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
        data: {type: 'md5', value: 'Hello World 1'},
        data_back: {step: 'step_message_response'}
    },
    {
        to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
        data: {type: 'md5', value: 'Hello World 2'}
        data_back: {step: 'step_message_response'}
    },
    {
        to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
        data: {type: 'md5', value: 'Hello World 3'}
        data_back: {step: 'step_message_response'}
    }
];

return _BatchCall({
    messages: $messages
});
```

## How to use

Use the manual way if you need some custom handling of the batch messages.
Use the infohub_batch plugin if you want to use the most common way to handle batch messages.

### Manual way

You can use the batch call as the example above. A full example of this is in the infohub_demo_batch plugin.
Normally you:
* send a batch message
* get the data back from each message individually
* store each response in the storage
* when you get the is_last_batch_message = 'true' then you load all stored responses and return them all.

Benefits: You can customise the way you want to handle the batch messages.
Drawbacks: If you use the most common way you need to write a lot of code. Then use the infohub_batch plugin instead.

Examples when you want to use the custom way:

* The individual responses are not important, and it is important to know when all messages have been handled.
* The individual responses are important, but you want to handle them in a special way and not temporarily store them in Storage, and it is important to know when all messages have been handled.
* You want to send batch messages to other nodes. The infohub_batch plugin do not allow that.
* You want to send batch messages to a child plugin. The infohub_batch plugin do not allow that.

Be aware: 
* Never take batch messages as an $in parameter and send them. That is unsafe. 
* Always create your own batch messages in your code. Batch messages that suite your needs.

### infohub_batch plugin

All the steps described in the manual way above is done in the infohub_batch plugin.
You have one for Javascript and one for PHP. They are identical.

Limitations made on purpose to avoid security issues:
* You can not call the infohub_batch plugin from another node.
* You can not send batch messages to other nodes.
* You can not send batch messages to a child plugin.

## License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Updated 2024-05-05 by Peter Lembke 
Since 2021-10-10 by Peter Lembke  
