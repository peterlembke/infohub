# Event system
An event system get an event message from any source and send the message to all subscribers.

&& event,system,feature

## Comment 1
There are problems with an event message pattern.

The event string - Should there be a system to make it unique for each plugin or should it be a feature itself that anyone can send out an event with the same event string.
The sender need to send the event on purpose using a string that might be unique or not.
The sender do not know if there are subscribers to the event message and bloat the message queues with messages that will be thrown away.

A better idea is an  override system where you can intercept incoming or outgoing messages to a function.
Then it works on all existing plugins. More about that separately.

# License
This documentation is copyright (C) 2023 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2023-08-12 by Peter Lembke  
Changed 2023-08-12 by Peter Lembke  
