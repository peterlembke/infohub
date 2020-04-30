# Infohub_Login_Login
Infohub_Login allow you to login to another node.
The PHP server version make sure the login is done without revealing secrets.  
The JS version has the same features as the PHP version and has a graphical user interface (GUI) where you can enter data that will be used in the login. 

## Browser client login to server
In your browser as soon as start.js has done its work and you got a working Infohub then the only option you have is to login.
Infohub_Login is the only plugin you have available.
The server (infohub.php) will not allow you to send anything else than a login request. Everything else will be discarded, and you will be banned.

When you see the plugin in Standalone mode it is much simpler than the full plugin you see in the Workbench. It is optimized to just login. The Workbench version will show you a lot more features.

## Node login to note in general
You are only allowed to send messages to a node after you have logged in.
Both nodes are already prepared to accept each other. Both nodes will prove that they know the shared secret.
Both nodes know what method to use to verify the identity.
The outcome from the login will be a session code to be used in the messages between the nodes.
The plugin infohub_contact will handle contact information between nodes. 
Plugin infohub_session will handle the session codes.

# infohub_contact
The plugin infohub_contact have all information needed to communicate with another node.

```
{
    'node' => 'weather',
    'note' => 'World best weather forecast',
    'domain_address' => 'infohub.yr.no',
    'user_name' => 'aabbccdd',
    'shared_secret' => 'jhgb78g0gnuognuognuyg',
}
```
See [infohub_contact](plugin,infohub_contact) for more information.

# infohub_session
The plugin infohub_session will handle the package_password after login.
See [infohub_session](plugin,infohub_session) for more information.

# infohub_transfer
The plugin [infohub_transfer](plugin,infohub_transfer) see if a message want to leave the node. 
Infohub Transfer check if there is an open session, if not then ask infohub_login to do a login to that node.

# infohub_login
When Infohub_transfer want to send a package to a node but has no session_code to use it calls plugin infohub_login. 
* Infohub_Login ask Infohub_Contact for connection information.
* Infohub_Login send out a login_request message.
* Infohub_Login get the login_request_response that contain a verification that the destination node is valid. Now you must answer their validation request. 
* Infohub_Login send the login_challenge message and get back the login_challenge_response.

The response from the node contain the result. You will get a static session_id and a package_password.

Any of the nodes can any time declare that the connection agreement is terminated by calling a function in [infohub_session](plugin,infohub_session).

## login_request
Infohub Transfer ask Infohub_Login to initiate a session with a named node. 
Infohub_Login will create a login request that infohub_transfer deliver to the node we want a connection with.
First Infohub_Login ask Infohub_Contact for credentials how to approach the other node. 
If Infohub_Contact do not have any credentials then Transfer will get an answer with an error.
If credentials exist then the `login_request` message will look like this:

```
{
    "to": {"node": "{name of node}", "plugin": "infohub_login", "function": "login_request"},
    "data": {
        "initiator_user_name": "", // Your Hub-UUID username
        "initiator_random_code": "", // BASE64 string with 256 bytes of random binary data
        "initiator_seconds_since_epoc": 45675678567.456
    }
}
```

## login_request_response
The seconds_since_epoc is important. If the responder find that the diff is more than 2 seconds then the request is stopped.
The responding node answer like this in the `login_request_response`:
```
{
    "answer": "true",
    "message": "Initiator user_name was found. Please respond with your initiator_calculated_id_code.",
    "initiator_user_name": "", // Same as in login_request
    "initiator_random_code": "", // Same as in login_request
    "initiator_seconds_since_epoc": 45675678567.456, // Same as in login_request
    "responder_random_code": "", // BASE64 string with 256 bytes of random binary data (new)
    "responder_seconds_since_epoc": 45675678568.234, // (new)
}
```
**NOTE that only new values will be in the response** 

## login_challenge
Now Infohub_Login must answer with a initiator_calculated_id_code in the `login_challenge` message.
```
"to": {"node": "{name of node}", "plugin": "infohub_login", "function": "login_challenge"},
"data": {
    "answer": "true",
    "message": "The responder_calculated_id_code was correct. You are who you say you are. Here is my initiator_calculated_id_code.",
    "initiator_user_name": "",  // Same as in login_request
    "initiator_random_code": "",  // Same as in login_request
    "initiator_seconds_since_epoc": 45675678567.456, // Same as in login_request
    "initiator_calculated_id_code": "", // The code you have calculated. (New)
    "responder_random_code": "", // Same as in login_request_response
    "responder_seconds_since_epoc": 45675678568.234, // Same as in login_request_response
}
```
**NOTE that only new values will be in the login_challenge** 

## login_challenge_response
The response from the responder node is in the `login_challenge_response` message:
```
{
    "answer": "true",
    "message": "Your initiator_calculated_id_code is valid. Here is the session_id we will use in all communication and the first package_password",
    "responder_calculated_id_code": "" // Calculated (new)
    "session_id": "",
    "package_password": ""
}
```
Now Infohub_Login must verify the responder_calculated_id_code and then decide to use the session_id and package_password.  

### Session_id and package_password
After login when you got the `login_challenge_response` you have the `session_id` and the first `package_password`.
Now infohub_login will provide most data to infohub_session.
See what happens next at [infohub_session](plugin,infohub_session).

# calculated_id_code
In the contact data in Infohub_Contact you have node, plugin, function to the function that will calculate and verify the calculated_id_code.
The same calculation method must be used on both nodes so you get the same result.
All data can be used in the calculations, including any data the both nodes already have about each other.

The default function will be here: 
* {"node": "server", "plugin": "infohub_login", "function": "id_code_new"},
* {"node": "server", "plugin": "infohub_login", "function": "id_code_verify"},

## calculated_id_code - default
This is the default method how the id_code is calculated and verified.
It is used by the initiator to calculate the initiator_calculated_id_code and to verify the responder_calculated_id_code.  
It is used by the responder to verify the initiator_calculated_id_code and to calculate the responder_calculated_id_code.  

## Base data
The calculations are based on the data from the login
```  
"initiator_user_name": "",
"initiator_random_code": "",
"initiator_seconds_since_epoc": 45675678567.456,
"responder_random_code": "",
"responder_seconds_since_epoc": 45675678568.234,
```
And they are also based on the data from the contact
```
'domain_address' => 'infohub.yr.no',
'shared_secret' => 'jhgb78g0gnuognuognuyg',
```
Also we have:
* We will use responder_seconds_since_epoc as seconds_since_epoc

## Method to calculate responder_calculated_id_code
Method: `infohub_login -> id_code_new`
* Merge initiator_random_code with responder_random_code to get final_random_code
* Take final_random_code and deduct the shared_secret to get the delta_code.
* Rotate the delta_code seconds_since_epoc steps to the right to get rotated_delta_code
* Merge the rotated_delta_code with the shared_secret to get the base_code
* responder_calculated_id_code = md5(base_code . initiator_user_name . seconds_since_epoc . domain_address)   

## Method to calculate initiator_calculated_id_code
Same as method to calculate responder_calculated_id_code with one change:
* Rotate with an additional 1 step to the right 

## Method to verify id_code
Method: `infohub_login -> id_code_verify`
First calculate the id_code and then compare with the provided code. 

# random_code
The random code is a random 256 byte long data sequence that are converted to a base64 string.

# _GetCurrentSecondsSinceEpoc
Function to get current seconds since epoc. The value are sent to the responder so the responder can verify that it is maximum a diff of 2 seconds compared to its own clock.
The value should be used when calculating calculated_id_code

# Man in the middle
If the initiator or responder try to use data sniffed from other traffic then it will be in vain. All data are fresh and can not be reused.
Both parties provide a long random number. The two random numbers are used together in the calculations on both sides.

# desktop_environment
The login looks different when launched in the standalone environment. It is simpler with less features. Optimized for just logging in.

# License
This documentation is copyright (C) 2018 Peter Lembke.
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2018-07-19 by Peter Lembke
Updated 2020-04-26 by Peter Lembke
