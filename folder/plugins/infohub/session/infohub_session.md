# Infohub_Session
When [infohub_login](plugin,infohub_login) have successfully logged you in to the remote server it calls infohub_session and provide some data.
infohub_session store the data. The data are used for calculating and verifying one time passwords.

Only infohub_transfer and infohub_login on the same node can use infohub_session. 

**Functions**
* responder_start_session
* initiator_store_session_data
* initiator_end_session
* responder_end_session
* initiator_calculate_sign_code
* responder_calculate_sign_code
* initiator_verify_sign_code
* responder_verify_sign_code

# responder_start_session
If the login was a success then infohub_login call responder_start_session to register a new session.

infohub_login then return a success message and the session data needed for the initiator.
  
**Incoming data**
* initiator_user_name - user_{hub_id}
* left_overs - Left overs from the login. Based on secrets but can not be reversed to the secret.

**The function store this data**
* initiator_user_name - user_{hub_id}
* left_overs - Left overs from the login
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals

Path contain session_id: `infohub_session\session\session_{hub_id}`  

Then it will be possible for the initiator to login on several devices with the same account.

**The function return this data**
* answer
* message
* ok
* initiator_user_name - user_{hub_id}
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals

# initiator_store_session_data
Used by `infohub_login` to store session data we got from the other node.  
  
Initiator get the session data and verify the session_created_at. It must be within 2 seconds.  
Then use `add_session_data` to store a session under a node name.

The initiator can now send messages to that node.

**Incoming data**
* node - Initiator want to use this node name to send messages to the node
* initiator_user_name - user_{hub_id}
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals
* left_overs - Left overs from the login

**The function store this data**
* node - name of the node
* initiator_user_name - user_{hub_id}
* left_overs - Left overs from the login
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals

Path contain node: `infohub_session\node\server`

**Returns**
* answer
* message
* ok

# initiator_end_session
Used by `infohub_login` to ask the responder to forget about the login and then delete the local session data.
 
**Incoming data**
* node - initiator use node name

Give the node name you stored the session data with in `initiator_store_session_data`.

The session data are pulled out and the other node are called `infohub_session` >> `responder_end_session`

If it was a success then we delete the session data locally.

**Returns**
* answer
* message
* ok

# responder_end_session
Used by infohub_session to ask the responder to forget about the login.
 
**Incoming data**
* session_id

The local session data are deleted.

**Returns**
* answer
* message
* ok

# initiator_calculate_sign_code
Used by infohub_transfer to get a `sign_code` for the query package.

**Incoming data**
* node - For requests
* messages_checksum - md5 checksum of all messages in the package

**Read the session data** 
Now I have these values too:
* initiator_user_name - user_{hub_id}
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals
* left_overs - Left overs from the login

**And create this value**
* sign_code_created_at

**Calculations will be**  
sign_code = md5(session_created_at . sign_code_created_at . left_overs . messages_checksum . session_id . initiator_user_name)

**Returns**
* answer
* message
* ok
* sign_code (string)
* sign_code_created_at // float with 3 decimals

**Transfer will add this data to each query package**
* session_id
* sign_code_created_at
* sign_code

# responder_calculate_sign_code
Used by infohub_transfer to get a `sign_code` for the response package.

**Incoming data**
* session_id
* messages_checksum - md5 checksum of all messages in the package

**Read the session data** 
Now I have these values too:
* initiator_user_name - user_{hub_id}
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals
* left_overs - Left overs from the login

**And create this value**
* sign_code_created_at

**Calculations will be**  
sign_code = md5(session_created_at . sign_code_created_at . left_overs . messages_checksum . session_id . initiator_user_name)

**Returns**
* answer
* message
* ok
* sign_code (string)
* sign_code_created_at // float with 3 decimals

**Transfer will add this data to each response package**
* session_id
* sign_code_created_at
* sign_code
 
# initiator_verify_sign_code
Used by infohub_transfer to verify a response package `sign_code`.

**Incoming data**
* node - node name
* messages_checksum (md5 checksum of all messages in the package)
* sign_code
* sign_code_created_at

Verify the sign_code_created_at that it is within 2 seconds.
  
**Read the session data** 
Now I have these values too:
* initiator_user_name - user_{hub_id}
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals
* left_overs - Left overs from the login

**Calculations will be**  
sign_code = md5(session_created_at . sign_code_created_at . left_overs . messages_checksum . session_id . initiator_user_name)
    
Verify the calculations of the sign_code.

**Returns**
* answer
* message
* ok

# responder_verify_sign_code
Used by infohub_transfer to verify a query package `sign_code`.

**Incoming data**
* session_id
* messages_checksum (md5 checksum of all messages in the package)
* sign_code
* sign_code_created_at

Verify the sign_code_created_at that it is within 2 seconds.
  
**Read the session data** 
Now I have these values too:
* initiator_user_name - user_{hub_id}
* session_id - session_{hub_id}
* session_created_at - micro time with 3 decimals
* left_overs - Left overs from the login

**Calculations will be**  
sign_code = md5(session_created_at . sign_code_created_at . left_overs . messages_checksum . session_id . initiator_user_name)
    
Verify the calculations of the sign_code.

**Returns**
* answer
* message
* ok

# License
This documentation is copyright (C) 2018 Peter Lembke.
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2018-07-20 by Peter Lembke  
Updated 2020-01-10 by Peter Lembke
