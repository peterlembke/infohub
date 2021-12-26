# preload of php files

When opcache is enabled then all php files that are started get compiled into opcode and stored in the opcache.

The preload is just a path that runs on web server start. Here you can list all PHP files you want to compile into opcode and put them in the opcache. Then when a file is needed PHP do not have to compile during run time.

## opcache config

The file opcache.ini 
```
; configuration for php opcache module
; priority=10
zend_extension=opcache.so
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 12
opcache.max_accelerated_files = 16000
opcache.validate_timestamps = 0
opcache.save_comments = 1
opcache.blacklist_filename = /etc/php/opcache.blacklist
opcache.preload=/var/www/folder/include/preload.php
```

The file `opcache.blacklist` is only used during development, so you do not have to clear the opcache on every change. 
```
/folder/plugin/infohub/*
/folder/include/*
/public_html/* 
```

## Preload

The preload just get all php files and run a compile command on each.

To clear the opcache you need to restart the web server or at least restart php.
