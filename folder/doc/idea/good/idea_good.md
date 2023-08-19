# Good ideas
A good idea is something that fit into the InfoHub concept of a secure personal operating system.

## What is/is not InfoHub

### InfoHub is
* InfoHub is for registering and storing your personal data so YOU can access it on all your devices.

### InfoHub is NOT
* InfoHub is NOT about sharing data with others. 
* InfoHub is NOT about being anonymous on the internet.
* InfoHub is NOT about making it easier to use other services that handle personal data.

## Example areas with good ideas

### Multi-processing
* JS Web workers - So I can encapsulate plugins from reaching each other
* JS Darkhold - Split a task on many web workers. Collect the web worker answers and return one answer.
* PHP Cron - A cron you can subscribe to and get a message when it is time. Can be used to take backups, clean out expired data
* JS Cron - A cron you can subscribe to and get a message when it is time. Can be used to save data to the server. Get updated data from the server in the background.

### Developer tools
* PHP Plugin test system - Tests will write them self. Will record live data.
* JS Plugin test system - Tests will write them self. Will record live data.
* JS Developer config - Enable the four restart buttons on the keyboard, view developer plugins, enable logging.

### System features
* Subscribe to messages - An intercept system for messages so plugins can be extended, modified, substituted.

### Accessibility
* Audio - Audio feedback when loading, saving, end of line and so on. This is a big and important area. Implementing in steps.
* Image - Set how image colours should be transformed to suite your eyes.
  This is now implemented in the colour schema.
* Font - Select the font type you prefer from the browser built in fonts.
* Keyboard navigation - tab index, short-cut keys.

Everyone benefits from better visibility on the web pages.

### Tree - Apps for personal data
* Tree - The main organizer for your pieces of data. Here all personal data is stored.

Each of the plugins below is a graphical interface that help you to register and view a specific kind of data.
Things I might implement.
* Project - You can set up tasks in projects here. Date when things must be done and when they were done.
  Some things become a project. A car. A damaged foot. A poor eyesight. Connect all other related items to the project.
* Health - Your health data. Resting pulse, Blood sugar, blood pressure, weight, measures.
* Subscription - Register your subscriptions, so you know when they start/end/cost.
* Prescription - Your glasses, your medicine. 
* Training - Your workouts like running, gym, spinning, walking etc.
* Thing - Register your larger things: What it is, when you bought it, serial number, warranty and so on.
* Usage - Register when you use a thing. Could be running shoes, moped, bicycle etc.
* Calendar - Your future and past todo and what you have done. Find data by date.
* Diary - How was your day. Write the text version of your day and use links to your data.
* Media (images/video/audio) - Your catalog with media and its metadata.
* Contact - The contact information to your friends and services.
* Budget - Calculate your income and expected expenses in this plugin.
* Expense - Register your purchases to keep track where the money goes.
* Review - Write your reviews of films, books, records, TV series, games, subscriptions, magazines.
  Then you can see what movies you have seen and when you saw them.
* Story - Pick data from the other plugins and put together a story that look like a newspaper.
* Place - You can register places you have visited and get a map with dots.
* Event - Register events you want to participate in or have participated in.

### Enrich personal data from outer sources
Data that the server fetch from 3rd party API or from other InfoHub servers and can enrich your personal data.
* Weather - Get the weather and temperature for a place and date.
* Map - Get a snapshot from an open street map
* Event - Get event details
* Holiday - Get data for your calendar
* Name of the day - Get data for your calendar
* Sun/moon cycles - So you know when it is dark and how dark
* Place - Wikipedia and news sites can tell you more about the place you mention

### Enrich personal data from calculations
* Pace - calculator for your workouts or running events
* Graph - Use data from the other plugins and select a graph to view the data.
* BMI - With your health data
* Time left - calculate time left to a date and time

### Static data that could enrich your personal data
Things I might implement.
* Country flags and country information.
  Can be used in your texts.
* Colour names and their colour codes.
  You can write the name of a colour, and it is then possible to see that colour.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2023-08-12 by Peter Lembke  
