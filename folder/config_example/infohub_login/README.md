# Main login account

The main login account does not need a database.
You put the main login account in infohub_contact.json and put that file in folder/config.  
That account is not public.
This account is used to log in to the InfoHub app and to manage the app without the need to have a database with users.

# Public login files

If you want to showcase your site or app, you can create a public login file. This file will allow users to log in without needing to create an account.

## Make downloadable

If you want a login file to be public, then put the file in folder/file/infohub_login.

See infohub_login.json how to configure one file for each domain you use.

If everything is configured right, you will see a download button on the login screen. Download the log in file and use it to log in.

## Allow login

Go into plugin "Contact" and import the account file.