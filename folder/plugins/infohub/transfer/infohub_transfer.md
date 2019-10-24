# Infohub Transfer
Handles data transfer between nodes.  

# Introduction
Infohub Transfer handle all traffic.   
If you want to communicate with the outside of your node then Infohub Transfer handle that.   
Infohub Transfer handle the messages that Infohub Exchange want to send to other nodes.

Infohub Transfer also handle all other communication like connecting to REST & SOAP APIs, downloading resources from the internet and so on.
 
## Client
Today the Client version of the plugin can do Ajax calls to the server and handle the response from the server.   
The client will _not communicate with anyone else than the server_ , not even with WebRTC. That is a privacy issue.  

## Server
Today the Server version can answer the Client request. The server can also handle requests from callback.php  
In the future the server node will also be able to communicate with other server nodes.  

In the future the server node will also add support for using web services that communicate with REST and SOAP.  
Child plugins can handle REST, SOAP, fetching RSS feeds, fetching HTTP resources from the web, FTP, email.
  
The important thing to remember is that ALL traffic must go trough Infohub Transfer. We have one place for communication outside of our node.

## Other nodes
There will be other types of infohub nodes. Some are built with NodeJs, Python, Ruby, Java. They will all be able to communicate with each other in the same way.

# Send to a node
Infohub Exchange send an array with nodes and their messages top Transfer. The send function in the Transfer plugin loop trough the nodes, if it recognize a node then it handles the messages.
  
Server (PHP): For node 'client' and for node 'callback' today it just makes a json package and echo it on screen.
  
When your messages have been sent and the answer comes back, the package are handled and the messages are put in the main loop for sorting.
  
You will also get back a timestamp when it is OK to contact the node again. That timestamp are stored in $globalBannedUntil.  

# Example
A package is an outgoing array with messages. 

## Outgoing package
This is an example of an outgoing package from the client to the server

It contains one message that ask for the full list of launchable plugins.   
In the callstack you see that the answer from the server will go to the last entry in the callstack.   
__client >> infohub_launcher >> update_full_list__

```
{
  "to_node": "server",
  "messages": [
    {
      "to": {
        "node": "server",
        "plugin": "infohub_launcher",
        "function": "get_full_list"
      },
      "data": {
        "list_checksum": "06116e36ba5d9136ed5ab217146b8c90"
      },
      "callstack": [
        {
          "to": {
            "node": "client",
            "plugin": "infohub_launcher",
            "function": "event_message"
          },
          "data_back": {
            "step": "step_end"
          },
          "data_request": []
        },
        {
          "to": {
            "node": "client",
            "plugin": "infohub_launcher",
            "function": "refresh_list"
          },
          "data_back": {
            "list_name": "full_list",
            "step": "step_update_full_list_response"
          },
          "data_request": []
        },
        {
          "to": {
            "node": "client",
            "plugin": "infohub_launcher",
            "function": "update_full_list"
          },
          "data_back": {
            "step": "step_get_full_list_response"
          },
          "data_request": []
        }
      ]
    }
  ]
}
```
    
## Incoming answer
This is an answer from the server to the client for the above package.

You see how much ban time we got from this request. 0.9 seconds. Means we can not ask the server anything until the ban time is up.  
We got the list despite our provided list_checksum is the same as in the answer. That is a bug. The correct answer would be to have an empty list and a 'do' => 'reuse'  


```
{
  "to_node": "client",
  "ban_seconds": 0.8841350078582764,
  "banned_until": 1560065505.271408,
  "messages": [
    {
      "to": {
        "node": "client",
        "plugin": "infohub_launcher",
        "function": "update_full_list"
      },
      "callstack": [
        {
          "to": {
            "node": "client",
            "plugin": "infohub_launcher",
            "function": "event_message"
          },
          "data_back": {
            "step": "step_end"
          }
        },
        {
          "to": {
            "node": "client",
            "plugin": "infohub_launcher",
            "function": "refresh_list"
          },
          "data_back": {
            "list_name": "full_list",
            "step": "step_update_full_list_response"
          },
          "data_request": []
        }
      ],
      "data": {
        "data_back": {
          "step": "step_get_full_list_response"
        },
        "response": {
          "func": "ReturnCall",
          "answer": "true",
          "message": "Here are the full_list",
          "data": {
            "name": "full_list",
            "do": "update",
            "micro_time": 1560065504.383653,
            "time_stamp": "2019-06-09 09:31:44",
            "list_checksum": "06116e36ba5d9136ed5ab217146b8c90",
            "list": {
              "infohub_configlocal": {
                "launcher.json": "d241719f7af5f9a48b2237bc24382310",
                "icon\/icon.json": "2f2e85f8ec3bbfbe92437e193bdcd5a0",
                "icon\/icon.svg": "b77ea680840cedc5fc5a744788db9905"
              },
              "infohub_contact": {
                "launcher.json": "ac06479aa0c31f370e658925e04f46cd",
                "icon\/icon.json": "141849f251412673628ae01ee94eb020",
                "icon\/icon.svg": "918503379fd346ad83cd835fcb2ad4bc"
              },
              "infohub_debug": {
                "launcher.json": "c3631dfc38137e1eb0da8c79e8c1756a",
                "icon\/icon.json": "440dc7b2d49dd858a3bb99d276aa4f1a",
                "icon\/icon.svg": "c17cc3a982328e8e780add9c820674f5"
              },
              "infohub_demo": {
                "launcher.json": "1ada2e32a12147f4738ec7bf9d9be8af",
                "icon\/icon.json": "27a55241891f9a1d5fc06d1ffb531a0c",
                "icon\/icon.svg": "5c901bcb78ffe8215bfe76d465bef8fc"
              },
              "infohub_democall": {
                "launcher.json": "19094210920e7d751dbe16d159a546a8",
                "icon\/icon.json": "acc4067ea4c4f1842300eda854816182",
                "icon\/icon.svg": "de95bff897fb35251690e915f3f9160a"
              },
              "infohub_doc": {
                "launcher.json": "725eed292171c3b742b2961cbda601ae",
                "icon\/icon.json": "44448e06df2559a87413837ab14cb71a",
                "icon\/icon.svg": "609ff33d2285db41ab192ddbbc6f941e"
              },
              "infohub_doc-old": {
                "launcher.json": "725eed292171c3b742b2961cbda601ae",
                "icon\/icon.json": "44448e06df2559a87413837ab14cb71a",
                "icon\/icon.svg": "609ff33d2285db41ab192ddbbc6f941e"
              },
              "infohub_keyboard": {
                "launcher.json": "eb9921143c4155d83a0682aa9b049ea3",
                "icon\/icon.json": "143b8ca6f60288900a24d74033faefb2",
                "icon\/icon.svg": "bc2d4b0f220183674b569ea4c1b5e01d"
              },
              "infohub_offline": {
                "launcher.json": "f441fa9d75dd4dc7f39ca843f2e734bd",
                "icon\/icon.json": "e57e95aa9d35eb50c504fa37795dda1b",
                "icon\/icon.svg": "7bf9086358c17bf2c684275c76b59556"
              },
              "infohub_tools": {
                "launcher.json": "6c881c27993ce22840520bc0779449a2",
                "icon\/icon.json": "5728757ab280ca3319c5fc82f430b73d",
                "icon\/icon.svg": "81e6b4343f306f172bc76a53f5d45a38"
              },
              "infohub_translate": {
                "launcher.json": "580377b4ae5886e4a04e85566a52902d",
                "icon\/icon.json": "20eca66833a37f01af6f6b30ae2d3272",
                "icon\/icon.svg": "87f7f594eeb61ae3cc52e77ca096c5f8"
              },
              "infohub_welcome": {
                "launcher.json": "d5d855dac272e24ffacd77cd1a11deca",
                "icon\/icon.json": "9b3f58ad6b33c41b1c4a1c243e203f4c",
                "icon\/icon.svg": "2e40d27ed2d196f2a83155e0899dce24"
              }
            }
          }
        }
      }
    }
  ]
}
```

# Future features
Features that are planned to be implemented.

## Offline
Handle messages when we are offline and want to send data to a node that we can not reach.   

 *If* the client is offline *and* Transfer want to send data to the server *and* the message has has a return node "client" *then* the messages will be answered with answer = 'false' and message = 'offline' 

## Leave callstack
The callstack can reveal many sensitive details if it follows the message to the next node. The callstack is not needed for a subcall to another node.

 *If* we send an answer to a request *then* we do not need to do anything.   
 *If* we send a subcall to another node *then* it is best to leave the callstack in our node, do the sub call and pick up the call stack when we are home again.

I will first implement this on the client. Later when we have server to server data transfer then we also need this on the server.

## Authentication (login)
Authentication between nodes, both parties will verify to the other who they are without revealing any pass phrases.  
The authentication will have a rest product, a long key that will be used to encrypt the traffic for this session.  

The authentication is done in software and we do not relay on any other features like https. 

## Sessions
Session handling. Since Infohub is stateless you do not store session variables, but you do need to know what rights the logged in session have. Not logged in users will only have the right to login if they can ask politely.  

PHP use cookies, we do not. The session information must be part of the package. That also make us independant of web technologies and we can implemt sessions in any communication form. 

## Server to server
The server node will be able to communicate with other infohub nodes and exchange information.

## Web services
A lot of interesting services exist on the internet. You can use REST to get weather from yr.no or get radio programs from sr.se  
The support in Infohub will be trough the server trough Transfer. The support for web services will be generic and can be misused for sharing. Do remember that Infohub is __NOT__ for sharing.

## Other ways of communication
Ways to communicate between phones at close range:
* The phone can send out audio and listen to audio. 
* The phone can flash colours or show QR codes and see with the camera.
* Import a package from a file and save a package to a file. Then carry the USB memory. 

# Bad ideas
Infohub is NOT about sharing. It is not about working togehter in small groups. Infohub is about personal data that only you can access.  
To achieve that we need to be very careful and think about security everywhere. Here are some bad ideas that will not be implemented and why.  

## WebRTC
Browser to browser communication.   
If we had a shopping site with many products and categories then one client could download data and share it with other clients directly.   
That would reduce the traffic and strain on the server.  
It would also mean that we expose our IP number and are no longer a small part in a bigger mass of data. We would be exposed.  
WebRTC is appealing but would open up a side door to the client. 

## Email
Would be cool if we could send emails to people. Then we could use that to send out offers, order confirmations (transactional emails) and use it as we would in an e-commerce site. We could even use Infohub as a marketing tool.  
Infohub is about privacy of your data. Email is insecure. Email can not handle private information. Even if we restricted ourself to only send emails to you when you ask them it would still be unencrypted and easily intercepted. You would also reveal yourself as a user of that infohub server.  
E-mail is an obsolete way to communicate. It should not be implemented in Infohub.

## Social
Infohub is NOT about sharing. Social networks is a bout sharing. No not mix them. You can still use social but not trough infohub.

## SMS
Sending SMS is an obsolete way of communicating. The amount of data is 120 byte unencrypted. It is easy to reroute the message to another phone.
SMS is insecure and Infohub will not use it. It can also be used for sending to many recipients and that is just annoying.

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Updated 2019-06-09 by Peter Lembke  
Created 2016-04-01 by Peter Lembke  
