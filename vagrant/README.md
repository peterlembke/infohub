# Vagrant development environment

Vagrant starts VirtualBox. VirtualBox is a software computer that runs an operating system.
Here we run Ubuntu 20.04 + the web server Apache 2 + the database MySQL + the language PHP 7.4

When you have installed VirtualBox + Vagrant and run `vagrant up` and then you can surf to
```
http://vagrant.infohub.local/phpinfo.php
and
http://vagrant.infohub.local
```

Read how you do all that in [installation vagrant](installation_vagrant.md).

## More to read
You can see all commands [here](https://www.vagrantup.com/docs/cli).

## Auto complete

You can install auto complete
``` 
vagrant autocomplete install --bash --zsh
```

## Update scripts
If you update the scripts and want to activate them then you write
``` 
vagrant provision
```

# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2020-07-22 by Peter Lembke  
Changed 2020-07-24 by Peter Lembke  
