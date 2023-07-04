# Design
Design decisions when creating InfoHub.

# Lead words in designing InfoHub
I refer to these rules every time I am in doubt how to solve something.

**No exceptions**
- Use ONE way to do things, and stick to it.
- For example: ALL traffic go the same way. ALL data are stored in the same way. and so on.

**Make it simple**
- Simple means to write code that everyone can read.
- Simple code often mean fast code. Choose simple over fast but avoid slow code.
- Choose solutions that are simple to understand and simple to implement.
- Let InfoHub stay small, simple and fast. Put new abilities in plugins.

**Self containing**
- A plugin have no dependencies on other plugins. (Learn how dependency free sub calls are done between plugins)
- A plugin can be used outside InfoHub in any other software project without changes.

# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2020-02-15 by Peter Lembke  
Updated 2021-12-26 by Peter Lembke  
