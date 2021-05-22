# Infohub Demo

Where ideas are tested

# Introduction

The demo plugin and its children is a way to show you how different things can be done in Infohub. Play with the demos,
read the code, debug them. You will get ideas how to solve your things with Infohub.  
There are two sets of demos, the client (browser) demos and the server demos.

# Client demos

The client demos start as a usual plugin in the Workbench. Here you have a menu with several demos to chose from. You
can read about each demo in detail from each documentation.  
The aim of the demos are to show all the rendering capabilities you can use in your plugins.

# Server demos

To start the server demos you will be using the callback system. Check out the file "
folder/plugins/infohub/callback/infohub_callback.json", here you find definitions to all the demos. A url will be shown
together with each demo description below.

## Demo 1 - Return a Camel Case String

The demo gets a pre defined lower case string in variable "my_variable" and converts it to camel case.    
Url: <a href="/demo/1" target="_blank">Demo 1</a>  
Definition in infohub_callback.json

```        
"demo1": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "1"
    },
    "data": {
        "my_variable": "the fox jump over the fence"
    },
    "data_back": {
        "read_return_parameter": "data"
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo1"
    }
},
```        

![My image](demo1.png)

## Demo 2 - Return an UPPER CASE STRING

The demo gets a pre defined lower case string in variable "my_variable" and converts it to UPPER CASE.  
Url: <a href="/demo/2" target="_blank">Demo 2</a>    
Definition in infohub_callback.json

```
"demo2": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "2"
    },
    "data": {
        "my_variable": "the rabbit dig a hole"
    },
    "data_back": {
        "read_return_parameter": "data"
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo2"
    }
},
```

![My image](demo2.png)

## Demo 3 - Calling functions

The demo make sub calls to different plugins and to an internal function.  
Url: <a href="/demo/3" target="_blank">Demo 3</a>  
Definition in infohub_callback.json

```
"demo3": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "3"
    },
    "data": {
        "my_variable": "I'll be back"
    },
    "data_back": {
        "read_return_parameter": "data"
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo3"
    }
},
```

![My image](demo3.png)

## Demo 4 - Get version data from several plugins

This demo shows how you can collect data from several plugins.  
Url: <a href="/demo/4" target="_blank">Demo 4</a>  
Definition in infohub_callback.json

```
"demo4": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "4"
    },
    "data": {
    },
    "data_back": {
        "read_return_parameter": "data"
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo4"
    }
},
```

![My image](demo4.png)

## Demo 5 - Call a child plugin

In this demo we call plugin: infohub_demo_child and its function hello_you to demonstrate how to use child plugins. The
child plugin return a nice greeting string.  
Url: <a href="/demo/5/my_name/Adam" target="_blank">Demo 5</a>  
Definition in infohub_callback.json

```
"demo5": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "5"
    },
    "data": {
    },
    "data_back": {
        "read_return_parameter": "data"
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo5"
    }
},
```

![My image](demo5.png)

## Demo 6 - How to use child plugins

This demo show how you can expand your plugin with children and dynamically call a child depending on the input on the
parent.  
Url: <a href="/demo/6/type/luhn/value/7992739871" target="_blank">Demo 6 - Luhn</a>,  
Url: <a href="/demo/6/type/md5/value/123" target="_blank">Demo 6 - md5</a>,  
Url: <a href="/demo/6/type/personnummer/value/640823323" target="_blank">Demo 6 - personnummer</a>  
Definition in infohub_callback.json

```
"demo6": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "6"
    },
    "data": {
    },
    "data_back": {
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo6"
    }
},
```

![My image](demo6-luth.png)
![My image](demo6.png)
![My image](demo6-personnummer.png)

## Demo Storage - Test the Storage class

With this demo you can manipulate data in the Storage. You can test different settings, read, write, delete data.  
Url: <a href="/demo/storage" target="_blank">Demo Storage</a>  
Definition in infohub_callback.json

```
"storage": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1",
        "localhost"
    ],
    "pattern": {
        "url_demo": "storage"
    },
    "data": {},
    "data_back": {},
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo_storage"
    }
},
```

![My image](demo-storage.png)

## Demo Test - Test any function

With this demo you can trigger any function with their default values and see the return call.  
Url: <a href="/demo/test/plugin/infohub_transfer/function/version" target="_blank">Demo Test</a>  
Definition in infohub_callback.json

```
"demo_test": {
    "enabled": "true",
    "ip_valid": [
        "127.0.0.1",
        "192.168.0.1"
    ],
    "pattern": {
        "url_demo": "test"
    },
    "data": {
    },
    "data_back": {
    },
    "to": {
        "node": "server",
        "plugin": "infohub_demo",
        "function": "demo_test"
    }
},
```

![My image](demo_test.png)

# License

This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-05-16 by Peter Lembke  
Updated 2018-09-27 by Peter Lembke  
