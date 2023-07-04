# Composer
In normal PHP projects there are no drawbacks with Composer. It is a good choice in projects like Magento2 and Laravel.

InfoHub is not a normal PHP project. I try to do something new that give more benefits, not more of what already exist.

My vision for InfoHub is to move away from files. Want to pull plugins from file, Cache, Storage, Web services.

&& file,install,plugin

## Comment 1
I will not use Composer for InfoHub. The consequence is that InfoHub plugins can not be used in Laravel or Magento2.  
I can write a PHP package that connect to InfoHub servers. Then M2 and Laravel can talk with InfoHub servers.  
Not using Composer also means that I need to provide another way to install software, but only just before software is needed.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2022-01-01 by Peter Lembke  
Changed 2022-01-01 by Peter Lembke  
