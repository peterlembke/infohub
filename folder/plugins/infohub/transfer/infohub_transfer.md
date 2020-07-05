# Infohub Transfer
With no exceptions handle all communication that goes outside of this node.  

# Introduction
Infohub Transfer handle all traffic.   
If you want to communicate with the outside of your node then Infohub Transfer handle that.   
Infohub Transfer handle the messages that Infohub Exchange want to send to other nodes.

## Client
Today the Client version of the plugin can do Ajax calls to the server and handle the response from the server. The client will __not communicate with anyone else than the server__. That is a privacy issue.  

## Server
Today the Server version can answer the Client request. In the future the server node will also be able to communicate with other server nodes.

## Other nodes
There will be other types of infohub nodes. Some are built with NodeJs, Python, Ruby, Java. They will all be able to communicate with each other in the same way.

# Send to a node
Infohub Exchange send an array with nodes and their messages to Transfer. The send function in the Transfer plugin loop trough the nodes, if it recognizes a node then it handles the messages.
  
Server (PHP): For node 'client' it just makes a json package and echo it on screen because the client is always the initiator an the server is always the responder.
  
When your messages have been sent and the answer comes back, the package are handled and the messages are put in the main loop for sorting.
  
You will also get back a timestamp when it is OK to contact the node again.

## Authentication (login)
The client can login to the server and get more rights. The plugin [infohub_login](plugin,infohub_login) handle the login and uses the [infohub_session](plugin,infohub_session) to initiate a session.

## Sessions
Session handling. Since Infohub is stateless you do not store session variables, but you do need to know what rights the logged in session have. Not logged in users will only have the right to login if they can ask politely.  

PHP use cookies, we do not. The session information is of the package. That also make us independent of web technologies and we can implemt sessions in any communication form.

## banned until
The responder set banned_seconds and banned_until in the responding package. Also stores the data on the session.
The initiator get the data and stores it. Then does not contact the node again until the current time is > banned_until.

The client is always the initiator.
The server is right now always the responder.
If any other node has a login account then they act as a client and has a session_id.

The server could send messages to other nodes and get data. I have not implemented that support yet so for now the server is always a responder. 

infohub.php checks the banned_until and can refuse access if banned_until > now.
infohub_transfer will add the configured amount of time to the session banned_until.

## Leave the callstack behind
The callstack can reveal many sensitive details if it follows the message to the next node. The callstack is not needed for a subcall to another node.

 *If* we send an answer to a request *then* we do not need to do anything.   
 *If* we send a subcall to another node *then* it is best to leave the callstack in our node, do the sub call and pick up the call stack when we are home again.

This is implemented on the client. Later when we have server to server data transfer then we also need this on the server.

# Example
A package is an outgoing array with messages. 

## Outgoing package
This is an example of an outgoing package from the client to the server.
```
{
    "session_id": "session_1587916349.1317:1026789844987178614",
    "sign_code": "f5baf6397e1a527404ff8a483f3ba4fc",
    "sign_code_created_at": "1587916362.526",
    "messages_encoded": "W3sidG8iOnsibm9kZSI6InNlcnZlciIsInBsdWdpbiI6ImluZm9odWJfYXNzZXQiLCJmdW5jdGlvbiI6InVwZGF0ZV9zcGVjaWZpY19hc3NldHMifSwiZGF0YSI6eyJhc3NldHNfcmVxdWVzdGVkIjp7ImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9hc3NldC9sYXVuY2hlci5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2Fzc2V0L2ljb24vaWNvbi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2Fzc2V0L2ljb24vaWNvbi5zdmciOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfYXNzZXQvdHJhbnNsYXRlL3N2Lmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfY29uZmlnbG9jYWwvbGF1bmNoZXIuanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9jb25maWdsb2NhbC9pY29uL2ljb24uanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9jb25maWdsb2NhbC9pY29uL2ljb24uc3ZnIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2NvbmZpZ2xvY2FsL3RyYW5zbGF0ZS9zdi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2NvbnRhY3QvbGF1bmNoZXIuanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9jb250YWN0L2ljb24vaWNvbi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2NvbnRhY3QvaWNvbi9pY29uLnN2ZyI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9jb250YWN0L3RyYW5zbGF0ZS9zdi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2RlYnVnL2xhdW5jaGVyLmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZGVidWcvaWNvbi9pY29uLmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZGVidWcvaWNvbi9pY29uLnN2ZyI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9kZWJ1Zy90cmFuc2xhdGUvc3YuanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9kZW1vL2xhdW5jaGVyLmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZGVtby9pY29uL2ljb24uanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9kZW1vL2ljb24vaWNvbi5zdmciOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZGVtby90cmFuc2xhdGUvc3YuanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9kZW1vY2FsbC9sYXVuY2hlci5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2RlbW9jYWxsL2ljb24vaWNvbi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2RlbW9jYWxsL2ljb24vaWNvbi5zdmciOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZGVtb2NhbGwvdHJhbnNsYXRlL3N2Lmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZG9jL2xhdW5jaGVyLmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfZG9jL2ljb24vaWNvbi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2RvYy9pY29uL2ljb24uc3ZnIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2RvYy90cmFuc2xhdGUvc3YuanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl9rZXlib2FyZC9sYXVuY2hlci5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2tleWJvYXJkL2ljb24vaWNvbi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX2tleWJvYXJkL2ljb24vaWNvbi5zdmciOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfa2V5Ym9hcmQvdHJhbnNsYXRlL3N2Lmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfb2ZmbGluZS9sYXVuY2hlci5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX29mZmxpbmUvaWNvbi9pY29uLmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfb2ZmbGluZS9pY29uL2ljb24uc3ZnIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX29mZmxpbmUvdHJhbnNsYXRlL3N2Lmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfdG9vbHMvbGF1bmNoZXIuanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl90b29scy9pY29uL2ljb24uanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl90b29scy9pY29uL2ljb24uc3ZnIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX3Rvb2xzL3RyYW5zbGF0ZS9zdi5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX3RyYW5zbGF0ZS9sYXVuY2hlci5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX3RyYW5zbGF0ZS9pY29uL2ljb24uanNvbiI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl90cmFuc2xhdGUvaWNvbi9pY29uLnN2ZyI6IiIsImluZm9odWJfYXNzZXQvYXNzZXQvaW5mb2h1Yl90cmFuc2xhdGUvdHJhbnNsYXRlL3N2Lmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfd2VsY29tZS9sYXVuY2hlci5qc29uIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX3dlbGNvbWUvaWNvbi9pY29uLmpzb24iOiIiLCJpbmZvaHViX2Fzc2V0L2Fzc2V0L2luZm9odWJfd2VsY29tZS9pY29uL2ljb24uc3ZnIjoiIiwiaW5mb2h1Yl9hc3NldC9hc3NldC9pbmZvaHViX3dlbGNvbWUvdHJhbnNsYXRlL3N2Lmpzb24iOiIifX0sImNhbGxzdGFjayI6W3siZGF0YV9iYWNrIjp7fSwiZGF0YV9yZXF1ZXN0IjpbXSwidG8iOnsibm9kZSI6ImNsaWVudCIsInBsdWdpbiI6ImluZm9odWJfYXNzZXQiLCJmdW5jdGlvbiI6ImNhbGxzdGFjay0xNTg3OTE2MzYyLjQ5OTo0NTY4Mjc0MjY1NjcyNjA1In19XX1d",
    "package_type": "2020"
}
```
We have a session_id so it means we are logged in. The sign_code is a md5 checksum.
```
$sign_code = md5($session_created_at + $created_at +  $left_overs + $messages_checksum + $session_id + $initiator_user_name);
``` 
sign_code_created_at is the seconds with decimals from 1970-01-01.
package_type = "2020" means that we have this setup with properties in the package.
messages_encoded is a base64 encoded array with messages. There is a [messages tool](plugin,infohub_tool_package) where you can paste the data and get the decoded data array back.
This is what we got from the data above.
```
[
    {
        "to": {
            "node": "server",
            "plugin": "infohub_asset",
            "function": "update_specific_assets"
        },
        "data": {
            "assets_requested": {
                "infohub_asset/asset/infohub_asset/launcher.json": "",
                "infohub_asset/asset/infohub_asset/icon/icon.json": "",
                "infohub_asset/asset/infohub_asset/icon/icon.svg": "",
                "infohub_asset/asset/infohub_asset/translate/sv.json": "",
                "infohub_asset/asset/infohub_configlocal/launcher.json": "",
                long long list
            }
        },
        "callstack": [
            {
                "data_back": {},
                "data_request": [],
                "to": {
                    "node": "client",
                    "plugin": "infohub_asset",
                    "function": "callstack-1587916362.499:4568274265672605"
                }
            }
        ]
    }
]
```
You see that it is an array [] with objects {} where each object is a message.
A message always have a: to, data, callstack. To is where the message wil be delivered on the node.
The data is the data you will find in the $in parameter in the function we call.

The callstack is the way back to the caller. We see that the message comes from node client, plugin infohub_asset.   
The function looks strange and it is because the rest of the callstack is left behind at the client. The code in "function" is used to find the callstack again when the server have returned the answer.
 
The message in the example request some assets from the server.  

Let us look at the answer from the server.
```
{
    "to_node": "client",
    "messages": [
        {
            "to": {
                "node": "client",
                "plugin": "infohub_exchange",
                "function": "event_message"
            },
            "callstack": [],
            "data": {
                "data_back": [],
                "response": {
                    "func": "ReturnCall",
                    "answer": "true",
                    "message": "Sign code is valid",
                    "sign_code_valid": "true",
                    "guest_valid": "false",
                    "initiator_user_name": "user_1587191584.7331:7782824742447055466"
                }
            }
        },
        {
            "to": {
                "node": "client",
                "plugin": "infohub_asset",
                "function": "callstack-1587916362.499:4568274265672605"
            },
            "callstack": [],
            "data": {
                "data_back": [],
                "response": {
                    "func": "ReturnCall",
                    "answer": "true",
                    "message": "Here are the assets you requested",
                    "data": {
                        "infohub_asset\/asset\/infohub_asset\/launcher.json": {
                            "plugin_name": "infohub_asset",
                            "asset_name": "launcher.json",
                            "extension": "json",
                            "contents": "{\n    \"plugin\": \"infohub_asset\",\n bla bla bla",
                            "checksum": "3e3634b8a6d489fc1443ec87d55b4934",
                            "is_binary": "false"
                        },
                        "infohub_asset\/asset\/infohub_asset\/icon\/icon.json": {
                            "plugin_name": "infohub_asset",
                            "asset_name": "icon\/icon.json",
                            "extension": "json",
                            "contents": "{\n    \"publisher_name\": \"Free SVG\",\n bla bla bla",
                            "checksum": "358d6dcce60bf7602dc530352b369092",
                            "is_binary": "false"
                        },
                        "infohub_asset\/asset\/infohub_asset\/icon\/icon.svg": {
                            "plugin_name": "infohub_asset",
                            "asset_name": "icon\/icon.svg",
                            "extension": "svg",
                            "contents": "<?xml version=\"1.0\" encoding=\"UTF-8\" bla bla bla",
                            "checksum": "f784577a945bda96a91b367a5840af3a",
                            "is_binary": "false"
                        },
                        "infohub_asset\/asset\/infohub_asset\/translate\/sv.json": {
                            "plugin_name": "infohub_asset",
                            "asset_name": "translate\/sv.json",
                            "extension": "json",
                            "contents": "{\n    \"version\": {\n        \"date\": \"2020-02-09 08:02:00\",\n bla bla bla",
                            "checksum": "1c22f98d970af8398f770b0c9fe2892a",
                            "is_binary": "false"
                        },
                        "infohub_asset\/asset\/infohub_configlocal\/launcher.json": {
                            "plugin_name": "infohub_configlocal",
                            "asset_name": "launcher.json",
                            "extension": "json",
                            "contents": "{\n    \"plugin\": \"infohub_configlocal\",\n    \"title\": bla bla bla",
                            "checksum": "2f9b4a7dfd552b85c2d01fa943b90355",
                            "is_binary": "false"
                        },
                        long long list
                    }
                }
            }
        }
    ],
    "ban_seconds": 0,
    "banned_until": 1587916362.851249
}
```
You can see that "package_type": "2020" is not implemented yet. This is the old style of the messages.

The task HUB-626 - Server: Response package. Comply to package_type = "2020"  
 
will change that but for now it looks like this.

# Future features
Features that are planned to be implemented.

## Client
Features that will come to infohub_transfer.js

### Offline/failed to login - answer the messages
If we can not deliver the package then we wait for a while but then we need to answer the messages that we could not send.
The messages are answered with "answer": "false" and "message": "offline" or "login failed".    

## Server
Features that will come to infohub_transfer.php

### Server to server
The server node will be able to communicate with other infohub nodes and exchange information.
This will be used to get data from specialized nodes.

### Leave callstack behind
When calling other nodes the server also need to leave the callstack behind to not reveal any data.

### Web services
A lot of interesting services exist on the internet. You can use REST to get weather from yr.no or get radio programs from sr.se  
The support in Infohub will be trough the server trough Transfer. The support for web services will be generic and can be misused for sharing. Do remember that Infohub is __NOT__ for sharing.

# Other ways of communication
If we ever develop other ways to communicate then we can be sure infohub_transfer is the place where data are exchanged.
* The phone can send out audio and listen to audio. 
* The phone can flash colours or show QR codes and see with the camera.
* Slow communication by importing a package from a file and save a package to a file. Then carry the USB memory. 

# Bad ideas
Infohub is NOT about sharing. It is not about working together in small groups. Infohub is about personal data that only you can access.  
To achieve that we need to be very careful and think about security everywhere. Here are some bad ideas that will not be implemented and why.  

## WebRTC
Browser to browser communication.   
If we had a shopping site with many products and categories then one client could download data and share it with other clients directly.   
That would reduce the traffic and strain on the server.  
It would also mean that we expose our IP number and are no longer a small part in a bigger mass of data. We would be exposed.  
WebRTC is appealing but would open up a side door to the client. 

## Email
Would be cool if we could send emails to people. Then we could use that to send out offers, order confirmations (transactional emails) and use it as we would in an e-commerce site. We could even use Infohub as a marketing tool.  
Infohub is about privacy of your data. Email is insecure. Email can not handle private information. Even if we restricted ourself to only send emails to you when you ask them it would still be unencrypted and easily intercepted. You would also reveal yourself as a user of that Infohub server.  
E-mail is an obsolete way to communicate. It should not be implemented in Infohub.

## Social
Infohub is NOT about sharing. Social networks is a bout sharing. Do not mix them. You can still use social but not trough Infohub.

## SMS
Sending SMS is an obsolete way of communicating. The amount of data is 120 byte unencrypted. It is easy to reroute the message to another phone.
SMS is insecure and Infohub will not use it. It can also be used for sending to many recipients and that is just annoying.

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Updated 2020-04-26 by Peter Lembke  
Created 2016-04-01 by Peter Lembke  
