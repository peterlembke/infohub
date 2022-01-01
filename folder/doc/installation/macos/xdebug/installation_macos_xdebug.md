# Install xdebug on macOS
If you use Docker then you need to do these steps.

In Docker, the `docker.local` is gone. You can no more know what IP number your container will have. Xdebug want to connect to a specific IP number.

This below seems to be the easiest way to set up xdebug to connect back to your IDE running on your host.  Similarly, this is a solution for any kind of situations where a container needs to connect back to the host container at a known ip address.

## Docker (Mac) De-facto Standard Host Address Alias
From [ralphschindler](https://gist.github.com/ralphschindler/535dc5916ccbd06f53c1b0ee5a868c93)

This launchd script will ensure that your Docker environment on your Mac will have `10.254.254.254` as an alias on your loop back device (127.0.0.1).  The command being run is `ifconfig lo0 alias 10.254.254.254`.

Once your machine has a well known IP address, your PHP container will then be able to connect to it, specifically XDebug can connect to it at the configured `xdebug.client_host`.

## Installation Of IP Alias (This survives reboot)

Copy/Paste the following in terminal with sudo (must be root as the target directory is owned by root)...

```bash
sudo curl -o /Library/LaunchDaemons/com.ralphschindler.docker_10254_alias.plist https://gist.githubusercontent.com/ralphschindler/535dc5916ccbd06f53c1b0ee5a868c93/raw/com.ralphschindler.docker_10254_alias.plist
```

Or copy the above Plist file to /Library/LaunchDaemons/com.ralphschindler.docker_10254_alias.plist

Next and every successive reboot will ensure your lo0 will have the proper ip address.

You are done!

## xdebug config in PHP
The xdebug3 configuration below already exist in the docker setup.  
You will get your `xdebug.client_host` into the container.

```ini
zend_extension=xdebug.so
xdebug.client_host=10.254.254.254
xdebug.default_enable = On
xdebug.mode=debug
xdebug.start_with_request=yes
xdebug.discover_client_host=yes
xdebug.max_nesting_level = -1
xdebug.log = "/var/www/log/xdebug.log"
xdebug.output_dir = "/var/www/log/profiler"
```

The docker setup will set this environment variable in your container:

`PHP_IDE_CONFIG="serverName=localhost"`

PHPStorm will use `localhost` as the server name when you set up the `Preferences > PHP > Debugging` profile.

You have to override the default xdebug settings in the file `docker/project.conf` (create it if it doesn't exist), and add the following line:
```
export XDEBUG_CONFIG="client_host=10.254.254.254 discover_client_host=false"
```

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2021-12-30 by Peter Lembke  
Changed 2021-12-30 by Peter Lembke  
