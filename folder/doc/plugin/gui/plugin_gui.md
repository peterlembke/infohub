# GUI
How to give your plugin a graphical user interface (GUI)  

# Introduction
You can add a GUI to your plugin so it can be used in Workbench. One good example you can look at is [infohub_doc](plugin,infohub_doc).  

# Asset
Add a folder called "asset" in your plugin folder. In there add a file called "launcher.json". This example come from Infohub Doc:  

```
{
    "plugin": "infohub_doc", // Your plugin callable name
    "title": "Documentation", // Your plugin human readable name
    "description": "You can read all documentation files with this application. You get a navigator and a document index",
    "icon": "icon/launcher.svg", // Do not change
    "icon_license": "icon/launcher.json" // Do not change
}
```

# Icon
Your plugin should have a nice looking icon. The plugin must be in SVG format (Scalable Vector Format). The benefits with this format is that you can zoom in and out and it looks good.  
In the plugin folder you should now have an "asset" folder, and in there you have your launcher.json with information about the plugin. Now create a folder in "asset" called "icon".
In the "icon" folder you place your SVG icon and rename it to "launcher.svg". Each icon must have a license file so Infohub knows that you have rights to show this icon. This goes for all material.
Create a file in "icon" called "launcher.json". Below is an example from infohub_doc:  

```
{
    "publisher_name": "Icons8.com",
    "publisher_url": "https://icons8.com",
    "publisher_note": "",
    "publisher_video_url": "https://www.youtube.com/channel/UCRXYx6Qg7kgH0EAqa-Gl0HA/",
    "collection_name": "Nolan",
    "collection_url": "https://icons8.com/icon/new-icons/nolan",
    "collection_note": "This icon is a part of a collection of Menu flat icons produced by Icons8. Icons follow the guidelines of iOS, Windows, and Android and are designed by a single designer, guaranteeing the consistent quality.",
    "license_name": "Use for Free, but Please Set a Link",
    "license_url": "https://icons8.com/license",
    "license_note": "The icons, sounds, and photos are free for personal use and also free for commercial use, but we require linking to our web site. We distribute them under the license called Creative Commons Attribution-NoDerivs 3.0 Unported. Alternatively, you could buy a license that doesn't require any linking.",
    "icon_name": "Menu",
    "icon_url": "https://icons8.com/icon/44024/menu",
    "icon_note": "Its an image of the icon representing a menu option. The image consist of three horizontal lines of equal length. Each line is separated by an equal length. Its like two rectangles stacked on top of each other with no sides."
}
```

Having proper license files to all material is a must. Infohub_Asset who handle all assets will simply delete assets that do not have a good license file.  

# get_launch_information
You need to add two functions: "get_launch_information" and "setup_gui". The first is used by Infohub Workbench to get information about your plugin by calling your plugin and "get_launch_information".
Your plugin ask infohub_asset for the content of asset/launcher.json and you return that to Workbench. You can take the function as it is from infohub_doc. You need no changes.  

# setup_gui
You need a function in your plugin called "setup_gui". This function is used by Workbench to set up your plugin GUI. Workbench will give you a box_id as a starting point.  
The box you got as a starting point can now be modified. I would recommend that you take a look at how [infohub_view](plugin,infohub_view) works.  
You will need one more function. It is a direct function that give you the full path to your starting point.  

```
$functions.push("_GetBoxId");
var _GetBoxId = function() {
    return 'main.body.' + _GetClassName() + '.body.gui';
};
```

Now when you want to render something to a box you created, lets say your box is called "index" then you can set "where" like this:  

```
'where': {
    'box_id': _GetBoxId() + '.index',
    'max_width': 320
}
```


# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2018-04-08 by Peter Lembke  
Updated 2018-04-08 by Peter Lembke  
