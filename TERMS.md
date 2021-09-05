# Terms of Infohub
These terms are based on the work made by [tosdr.org](https://tosdr.org/) and their [checklist](https://github.com/tosdr/tosdr.org/wiki/checklist).

The Infohub software is licensed under GNU GENERAL PUBLIC LICENSE Version 3. You can modify the software and use it however you want.

The branding "Applies to the Infohub terms" and/or the corresponding logo can only be used on your site if you the site owner apply to the terms in this document.

Created at: 2020-02-08 by Peter Lembke, Infohub
Updated at: 2021-08-01 by Peter Lembke, Infohub

## Words we use in this document
- **you** - that is you the responsible party for the site.
- **site** - That is the Infohub web site you are responsible for.
- **Infohub** - That is we that create the Infohub software.
- **Infohub software** - The software that you use on your site.
- **users** - Persons and other Infohub servers that you invite to login to your site.
- **we** - That is you and the people at Infohub and your users together.

## Does the service use first-party and/or third-party cookies?

Infohub never ever use ANY cookies on live sites. We are not allowed to add any cookies to Infohub on a live site.

While developing Infohub we use a debugging cookie so that xdebug and similar debug tools works during development.

If you see Infohub using any cookie then please report an issue on [Github](https://github.com/peterlembke/infohub/issues). 

## Can Infohub change the terms at any time?

Infohub can change the terms in this document at every new version of the Infohub software.

Old releases keep their terms.

The terms will not have a changelog. If you are interested then you can compare terms from different releases on Github.

The document has a date when it was first added and last modified by Infohub.

## Do Infohub claim copyright (or what sort of license) over your content (where applicable)?

The very purpose of Infohub is to be a private place on the web. The data provided by users remain their own property.

## Do users have a right to leave your service?

Yes.
 
- The user can download private data.
- The user can delete private data.
- The user can delete its login account.

Infohub software provide the tools for this.  
You the site owner must make these tools available to all users.

The user should not use a site if this download tool is missing.

A person can not register or demand to become a user of the site. A person can be invited by the you site owner to become a user of the site. You the site owner can just as easy revoke the invitation. 

## Can the users export their data (where applicable)?

You as a site owner has no obligation to take backups or care for the user data. The user must take backups of its own data and make sure they can read the data themself. 

Infohub software provide a data download tool for data added to the Tree plugin.
 
You the site owner must make that tool available to all users. 
 
If a user do not have that tool available then it is the users responsibility to not add any data to your site until the tool is available.

## How do we work with third parties (contractors we use)?

A 3rd party is every service that the Infohub software exchange data with that is not a user.

The Infohub software and the site owner can use any service from the server as long as it never ever share private user data in any way.

- Examples of allowed services: RSS, Yr.no
- Examples of prohibited practice: Scrape other sites pages.  

One example that is prohibited is sending an email or SMS to a user. This is prohibited because there is a 3rd party involved and the user telephone/email address are then revealed.

The use of 3rd party client side services are prohibited because all data must go through the server. We can not secure the client side if we do not know what code is running there.

Examples of prohibited services: Google maps, Spotify, Soundcloud, Open street map, Youtube, Vimeo, Daily motion. Also CDN services, iframes and files linked from any server are prohibited.

It is the users responsibility to not use a site that provide client side 3rd party services.

The user must protect its data by using secure web browsers like Firefox, Safari, Brave, DuckDuckGo. And also be sure not to use browser plugins that leak data to 3rd party. 

The Infohub software need to be on a private web server or at a web hosting company so the users can connect. You as a site owner is responsible for using https in your domain address. The user is responsible for not using a site that have issues with the certificate.

You the site owner is not allowed to remove the client side scanner that detects possible data breaches.

## How do you work with government requests?

You as a site owner must apply to the laws of your country.

If a site owner can not protect the anonymity and privacy of the site users then the site owner must quickly delete all the users private data and the users login accounts and all database backups that contain private user data.

## How do you handle decisions about suspension of a user account when you feel the user breached the terms?

A person can only become a user by an invite from you the site owner. You the site owner can at any time redraw the invite without having to give the user any reason. But it is always best to communicate human to human before doing this.

Examples of reasons could be that the user have poor security on its computer, browser, browser plugins. Have shared the login credentials with others. Have uploaded more material than agreed on. Have not logged in to the site for a month. Have done manipulations to the client side code.

If you as a site owner do not want a specific user on your site then mark the user as "You got two weeks notice to move from this site, and then you will be automatically deleted".

The Infohub software will refuse the user to save any more data to the server Storage.

The Infohub software show a message to the user when the user login. The user can download its private data and delete the account.

The user can later find another Infohub home to use and upload the data there.

After the time period the Infohub software will delete the user private data and the user account.

The delete will occur regardless if the user have seen the message or not and regardless if the user have downloaded its data or not.

There might be a situation where an older database backup have to be restored on the site and a user account are accidentally restored. That account will then be deleted by the Infohub software at the next clean out.

If the privacy of the site have been breached then the site owner might delete all user accounts and all user data without any notice to protect everyones privacy.  

## Do they (try to) prohibit you from going to court against them?

If you as a site owner want to go to court and sue Infohub then please do.
The Infohub Software is licensed as GNU GPL v3 and we operate in Sweden.

If the user want to sue you as a site owner the please do.
The user is obligated to have read the TERMS.md and know about who is responsible for what.

In any case it is always best to resolve issues human to human before going further.

## What happens to your data when your site get acquired or when you shut down the service?

It is the users responsibility to regularly use the data download tool to have a copy of the own data.

It is the users responsibility to have a working copy of its encryption key.

You the site owner that "Applies to the Infohub terms" must check with the site buyer if they intend to continue with "Applies to the Infohub terms" or not. If the new owner will apply then you only need to change the responsible persons name so all users can see that.

If the new owner will not apply to the terms then you must mark all users with "New owner will not apply to the Infohub terms".

The users then have two weeks notice to accept the new owner by marking that. Or their account will be deleted. 

The user can download its data before the account is deleted. 

If you will shut down the site then it would be nice to give the users a two weeks notice before the users and their data are automatically deleted. 

## How long do you keep user private data and what do you use it for?

The user private data are encrypted with a key that only the user have. The encrypted private data might be saved on the server database. The server database might get a backup made by you the site owner or by the web hosting company.

You the site owner should make a statement about the backup strategy and also check with the hosting company how their backups work and relay that information to the user.
Should is not a must.

You the site owner should also make a statement on how the backups are stored and have a plan so that there is no risk of exposing the backups to others.
Should is not a must.

The user should only use sites that can tell what backup strategy they are following.

## Advertising

The Infohub plugins must be clean from advertising. You could mention optional related plugins in the documentation.
You must not show advertising to the user. Not even if the data comes from the server. If you want to promote something then use other channels for that, like social media.

## Log usage of features

The client software are not allowed to track usage statistics, not even anonymous data. The client must be free from trackers.
The Infohub server can have anonymous usage statistics but that need to be stored in a tool that you manage. Like https://matomo.org/ if you host it yourself.

## Bugs

Server bugs are logged to a text file with no personal data. You are allowed to send anonymous data to a log tool you host yourself, like GrayLog.

A client bug is always shown on screen at the top. Client bugs are never reported back to the server. They might have to be in the future. You are allowed to forward anonymous client bug data to a log tool you host yourself, like GrayLog.

__End of document__
