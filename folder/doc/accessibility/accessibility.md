# Accessibility
Accessibility is for making the software in a way so that as many people as possible can use it. Infohub aim to be perfect at that.

[columns]
Not everyone has perfect locomotor activity together with sharp eyesight that see all colours.

People with normal sight also benefit from these systems. 

Accessibility in Infohub include:

* Translations - Different languages
* Colour - Colour schema that suit you best.
* Size - Font type, font size, bold - Select a size schema.
* Audio - Feedback when clicking something.
* Vibrate - Feedback when clicking something.
* Speech Recognition - Speak and it becomes text.
* Speech Synthesis - Text to speech. 
* Image - Set how image colours should be transformed to suite your eyes.
* Keyboard navigation - tab index, and short-cut keys.
* Zoom - Everything larger without panning.
* Design - Keep the design together.

# Translations
You can read more about translations [here](plugin,infohub_translate).

All plugins that have a graphical user interface can also have language files with translations.

# Colour
Pick a Colour schema or create your own.
All GUI components will use this colour schema.

# Size
Pick a size schema or create your own.
All GUI components will use this size schema.
You can configure font name, size, bold/italic on different places.
button text, list options, text, textarea, labels.

# Audio
Pick an audio schema or create your own.
All GUI components will use this audio schema.
You then get a feedback sound for:
* click button
* select in dropdown
* expand/compress boxes
* Type text - character, newline, end of line, space.
* Navigate with the keyboard
* Set or unset a checkbox
* Set a radio button
* Button OK
* Button FAIL
* Exception - an error occurred and shown on screen
* sanity error - an external link was found in DOM
* Submit error
* Offline - switching from online to offline
* Online - switching from offline to online

# Vibrate
All items in the audio schema can also have a vibration feedback.
Pick a vibration schema or create your own.

All GUI components will use this vibration schema.
There are different preset vibration sequences you can use.

I will create labs on vibration.

# Speech Recognition
The browser has a [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) where you can get Speech Recognition and Speech Synthesis.
I will create labs on speech recognition. If it works then Infohub will get that for navigation and for text input.
  
# Speech Synthesis
The browser has a Web Speech API where you can get Speech Recognition and Speech Synthesis.
I will create labs on speech synthesis. If it works then Infohub will get that for navigation and for reading text.

# Image
There are different kinds of colour blindness. By modifying the colours on the image you can more easily see differences in colour. The image gives you more value.
Infohub will support adding colour correction for the most common versions of colour blindness. I think there are four.
 
# Keyboard navigation
The target navigation devices are touch and keyboard. Mouse is not a target device.
Keyboard navigation is very quick for people with normal locomotor system and the only way to navigate if you can not handle a mouse or a touch screen.

* You will be able to navigate with the normal tab / shift tab / enter / esc.
* You will also be able to navigate with shortcut keys.
* And you can navigate with the arrow keys.

# Zoom
Everything larger without panning. Still looking good.
Zooming on a mobile phone makes things on the screen move beneath each other, so you have to scroll more up down but nothing to the sides.

# Design
Target device: 
Small mobile with touch or keyboard.

Mouse is not a target device.

* No blips and blopps - unneeded motion
* No popups
* No dropdown menus
* No overlays
* No mouse hover
* No mouse tooltips

[/columns]

# License
![left](icon.png)
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2018-01-18 by Peter Lembke  
Updated 2021-08-28 by Peter Lembke  
