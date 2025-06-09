# Bad ideas
A bad idea could be something that is useful but does not fit into the InfoHub concept.

It is sometimes hard to detect these ideas. Here is a guide how to think about them.

## What is/is not InfoHub 

### InfoHub is
* InfoHub is for registering and storing your personal data so YOU can access it on all your devices.

### InfoHub is NOT
* InfoHub is NOT about sharing data with others. 
* InfoHub is NOT about being anonymous on the internet.
* InfoHub is NOT about making it easier to use other services that handle personal data.

## Example areas with bad ideas

### Using web services
Totally fine if the server use a web service to get public data. For example weather data. Calendar data. EU open APIs.
Not fine if the client communicate with any other than the server.
It is not fine if the server communicate with a service that handle personal data. The credentials can not be protected on the server.
It is not fine to send credentials to the server and there log in to the service. The server should not deal with unencrypted credentials and should not act on behalf of you.

### Download personal data
If you want your bank data, Garmin training data downloaded to InfoHub then first download the data with other software and then upload it to InfoHub.
InfoHub can not safely handle your credentials.
Garmin does not have an open API, so it is not cool to force break it. The data on Garmin is their property, so you must act according to Garmin rules.

### Client to a social network
All information you store on for example Google, Facebook, Twitter, Instagram and so on is the property of the company. 
You may think that you own the data since you are allowed to delete some data but that is not the case.
Use the social networks as they were intended to be used, or don't use them at all.

### Embed contents
The iframe tag has a sandbox feature. That sandbox feature makes it better but not good enough. You are still tracked.
I have experimented with click and embed. That works but should not be encouraged since if you click you are tracked.
Some hard code privacy advocates have disabled Google in their HOSTS files, then any YouTube embed would fail.
It is much better to show an image with a link that opens in a new tab.
The iframe renderer now renders a link instead of the embedded contents. Do not use iframe. Do not embed contents.

### Communication
Sending Email and Slack feels like a valid usage. But be aware that the server must keep the credentials on the server and that is not fine.
InfoHub is also not about sharing.

### Editor
There is no privacy concerns in using local software to edit images, video, audio, text.
There is no point in building that kind of software into InfoHub.
Use your locally installed software and upload the data to InfoHub.

### File manager
All data should be in the databases. Having a file manager would make it easier to deal with files.
Use FileZilla instead and let it be a bit hard to deal with files.

### Reach hardware like Webcam, Microphone, GPS, Tilt
It is not fine to ask for the webcam, microphone, gps, tilt features and so on.
Anything that actively detect the surroundings should not be asked for.

If you want to track your GPS position then do that with another software and upload the GPS data afterwards to InfoHub.

### E-commerce
The e-commerce world is heavily tracking every move. Every move you say? Yes [like this](https://openreplay.com/).
It would be very helpful to the consumer if the e-commerce industry did not know all details of my shopping.
Even if I feel for all consumers it is not the purpose of InfoHub to be anonymous on the internet. That might change in the future.

### Games
There ate a lot of frameworks that handle games. You have for example Steam, Apple Arcade and so on. You can also install local games.
InfoHub is not a platform for gaming. If you want to register personal data from a game then do that manually in InfoHub or upload data manually.

### Lookup
Address to lat/long, and lat/long to Address is not fine. IP to country/city/street is not fine.
If you need a GPS location then look it up with a web page and enter the data in InfoHub.

### Reverse engineer APIs
Not cool to do this. The API provider own the API and do not want freeloaders in their garage.

### Scraping data
Data that was intended for view on a web page can be stolen. It is not cool to do that unless it is your site, and you give yourself permission.

### Public data
InfoHub is about privacy and private data. Stockpiling public data in InfoHub is not very useful.
Often an external link to Wikipedia would be better if you want to read publicly available information about a city, a name, a date etc.

### Processing data and cron jobs
InfoHub is not a data processing platform. It is a platform for your personal private data.
If you want to process data in queues, please use Laravel for that.
Same thing with maintenance jobs started with a scheduler like crontab. There should not be anything to maintain in InfoHub.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2024-11-10 by Peter Lembke  
