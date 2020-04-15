# Infohub Storage Data Redis
Handles storage connections  

# Introduction
[Redis](https://redis.io/) is one of the supported database engines that Storage can use.  
Redis is quick, it uses the memory to store data. It is persistent since it dumps data to the hard drive occasionally.  

# Installation
* _In Ubuntu_ `sudo apt-get install redis-server` and `sudo apt-get install php-redis` and `sudo apachectl -k restart`  
* _In MacOS_ `brew install redis` and `brew install --HEAD homebrew/php/php70-redis`  
* _In Windows_ See the [Redis](https://redis.io) home page  
* _Docker_ You can run redis from a docker container. Read more here [Docker Redis](https://hub.docker.com/_/redis/). You can start several containers on the same computer. Each have its own port.  

# Setup
You do not have to set up any users  

# Testing
Run redis-cli to get a command prompt for Redis-commands. Write "ping" and it would respond with "PONG".  
set - Stores data in Redis: SET mykey ”Hello”  
get - Reads data from Redis: GET mykey  
del - Removes data from Redis: DEL mykey  
exit - Leave the redis-cli by writing: exit  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-08-19 by Peter Lembke  
