# Infohub Contact
Plugin that manager contact information.  

The contact information is for: 

* Clients login to your server. 
* Your server is a client when it logs into another server 
  
This contact manager is both a PHP and a JS plugin. The PHP plugin handle the data. 
The JS plugin handle the graphical user interface.

## How contact data is used
A node can be you with a browser trying to login to the server, or a server trying to login to another server.
When a node want to talk to another node then your node are the initiator and the other node is the responder.

If your server want to login to another server then it uses the contacts from the "Sever contact" list.
Your server then act as the initiator.

When someone want to login to your server then your server check in the "Client contact" list.
Your server then act as a responder.

The plugin infohub_contact has contact data generation, export and import of contact data.  
You have got your contact data manually from the other node.
The transport of the contact data to the other node is up to you. Perhaps as an encrypted message or give a USB-memory to the other person.

## Contact data examples
Here you see four examples of how the contact information are used. A client login to the server. A server login to a client. Your server login to another server. Another server login to your server.

### Client login to server
A person with a browser want to login to your server. This is the contact information about Abe Lin. Both Abe and the server have this contact information.

```
{
    'node' => '',
    'note' => 'Abe Lin',
    'domain_address' => '',
    'user_name' => '567746854564876579',
    'shared_secret' => '8654857896578659765975696597657965976',
}
```
    
You check the clients list for login information.

Abe tell that he is a client user. We then find a contact that has no domain_address and the correct user_name. Both parties prove that they know the shared secret.

### Server login to a browser client
A server want to login to a browser client. This is actually not possible. The browser client is dependant of the server and comes from the server, the client can not be accessed. 
And even if we have two way communication it is still not two self sufficient parties that communicate.  
If the server want to login to the browser that Abe lin has then it is just impossible.

#### My server login to another server
Your server want to contact another server to get or put data.

```
{
    'node' => 'weather',
    'note' => 'World best weather forecast',
    'domain_address' => 'infohub.yr.no',
    'user_name' => 'aabbccdd',
    'shared_secret' => 'jhgb78g0gnuognuognuyg',
}
```

You check the server list for login information to the other server.

Your server can send messages to that node. Infohub Transfer will use the contact information to login to the other server and leave the messages and collect all answers.  
The contact information is used by the unique node name. In this case 'weather'.  
The other server is found by the domain_address. Infohub Transfer will login on that domain using the user_name.  
Then both parties have to prove that they know about the shared secret.

#### Another server login to my server
Worlds best weather forecast server want to leave some forecasts on your server because you subscribe to them.

```
{
    'node' => 'weather',
    'note' => 'World best weather forecast',
    'domain_address' => 'infohub.yr.no',
    'user_name' => 'aabbccdd',
    'shared_secret' => 'jhgb78g0gnuognuognuyg',
}
```

You check the clients list for login information.

You see that the incoming request come from the ip that correspond to infohub.yr.no.  
The request want to login with user_name aabbccdd. You both prove that you know the passphrase.

Note that the infohub.yr.no server have other names in their contact information.
```
{
    'node' => 'subscriber_556',
    'note' => 'Subscriber 556 to the World best weather forecast',
    'domain_address' => 'the.destinationurl.se',
    'user_name' => 'aabbccdd',
    'shared_secret' => 'jhgb78g0gnuognuognuyg',
}
```
 

## Server
The server part. This plugin will only be used by those that have rights to use it.

### save_node_data
PHP function to save node data to the Storage.  
If a shared_secret is missing then one is generated on the server.

### delete_node_data
PHP function to delete node data in the Storage.

### load_node_data
PHP function to load node data from the Storage.

### load_node_list
Puts together a list with all node names. The list come from the Storage keys.

### import_node_data
Ask Infohub File to import a contact file and give it to this function.

### export_node_data
Ask Infohub File to export contact data to a file.

## Client
The client part.

### setup_gui
Render full gui with empty node list. List refresh button. Form. Buttons in one function one box. Area for displaying message. setup_gui

### click_refresh
Get list from server. Let render form render the list.

### click_list
Load data from server. Populate form.

### click_new
Empty the form.

### click_save
Read form and send to server.

### click_delete
Read form and send delete to server.

### click_export
read form. Call view to create a file.

### click_import
Select a file. Populate the form.

## License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2018-07-21 by Peter Lembke  
Updated 2019-08-31 by Peter Lembke
