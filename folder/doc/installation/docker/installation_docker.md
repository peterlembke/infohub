# Install the Docker environment

## Modify the HOST file
You need to add some names to your local HOSTS file.
```
sudo nano /etc/hosts
```
and add this to the file
```
127.0.0.1   local.infohub.se
127.0.0.1   cacheserver
127.0.0.1   dbserver
127.0.0.1   proxyserver
127.0.0.1   webserver
127.0.0.1   ElasticSearch
```

## First Boot
This assumes you installed `dox`. If you didn't, all `dox` commands should be replaced
with `docker/run.sh` and you have to `cd` to the project root directory to run them.
```
dox sync start # Mac only. This will take a while the first time
dox up # This will also take a while the first time
```

## Let PHP find the database
If you get super slow database connections from the Docker box then do this:
Check that project.conf and project.conf.dist has your database ip
```
export DB_URL="db.infohub.se"
export DB_IP="127.0.0.1"
```
Check that the app Docker box has the information
```
dox shell app root
nano /etc/hosts
```
If not then it will be added there when you do a `dox start`

## Ordinary Usage
On Mac, `docker-sync` has to be started, like on the first boot.
```
dox start # Boots up the environment
dox stop # Shuts down the environment
dox # Shows a list of available commands
```

## Modify config files
If you modify the config files like `/dox/images/web/default.conf` and you want them to be activated you need to do this:
```
dox stop  
dox build --no-cache
dox up
```

## Xdebug
Xdebug is disabled by default for better performance. To enable it, you have to run:
```
dox xdebug on
```

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2021-12-26 by Peter Lembke  
Changed 2021-12-26 by Peter Lembke  
