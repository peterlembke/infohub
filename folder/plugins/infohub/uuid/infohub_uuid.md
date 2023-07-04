# InfoHub Uuid

Universal Unique Identifier. You can get UUID0, UUID4 and the new infohub_uuid

# Introduction

A UUID is a string that is fairly unique. You can use it to identify a message, as a database key etc.  
If you would ask a central server for a truly unique string, then it would take time and the application would be
dependent on the service to always work. UUID is a way to fairly say that the UUID you create is likely to be unique.

# uuid0

Used for testing purposes. Always returns '00000000-0000-0000-0000-000000000000'

# uuid4

A 16 byte random number. It has the same format as UUID0 and is totally random.

# Other UUID versions

Version 1,2,3,5 of the UUID standard also produce the same format but base their data on time and MAC number or domain
name. I have not implemented those versions because I do not want to reveal the MAC number or anything that can trace
the UUID.

# InfoHub UUID (default)

THe UUID4 is a totally random number. This means that an infinite number of UUIDs will eventually produce a UUID that
is already in use. I do not like that.  
I have created my own UUID. I want the UUID to be time+random so that old UUIDs are safe from new UUIDs. Another goal
with the time is to see what UUID was created first. And a third criteria is that the UUID must be very simple to
implement  
The infohub_uuid have three parts, Seconds since EPOC, a "." and then milliseconds, a colon : and then a 16 byte random
number.

## Milliseconds

If your programming language do not have milli or micro seconds on the EPOC then you can create a random number between
000 and 999 and count up with a modulus of 1000.

## Random number

Do what you can here. PHP can produce any number of random bytes. Javascript can create a random float number between 0
and up to but not including 1.  
I have removed the 0. from the javascript number, but you could very well keep it.

# Calling UUID

When you call the main function "uuid", you can set the version and the number of UUIDs you want.

```
{
    "to" {"node": "client", "plugin": "infohub_uuid", "function": "uuid",
    "data": {"version": 4, "count": 100}
}
```

In the example you get 100 UUID4. If you omit the parameters you would get 1 "infohub_uuid"  
The function first add all UUIDs into an index and then convert the index to a normal array. That is to prevent possible
duplicates without having to compare all generated UUIDs. You can `_Pop` data from index.

```
return array(
    'answer' => $answer,
    'message' => $message,
    'data' => $first, // First generated UUID
    'array' => $out, // All generated UUIDs in an array
    'version' => $in['version'],
    'count' => $in['count']
);
```

# Usage in infohub

All messages that are leaving the node must have a UUID. All incoming message that come from another node must have a
UUID.  
When all messages have this then I will implement some features with the messages:

## Leave the call stack at home

When sending a message to another node then I will detach the call stack and save it before sending the rest of the
message. If the message do not return within 5 seconds then I consider the message to be lost. I will then create a fake
answer so the message do not get stuck.  
By leaving the call stack at home I also prevent it from being manipulated.

## Many UUIDs

InfoHub Transfer will need a lot of UUIDs to attach to the messages and will then ask for a bunch of UUIDs to use.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2018-07-28 by Peter Lembke  
Updated 2018-07-29 by Peter Lembke  
