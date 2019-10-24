# Build your renderer
The graphical user interface (GUI) are built by renderers. You can build a renderer with this guide  

# Introduction
This guide will show you how to create your own renderer that you can use to render part of the GUI.  
You have full information about how to use existing renderers here: [InfoHub Render](plugin,infohub_render)  
Read that section first and train on the examples. Then you can read this document how to build your own renderer.  

# Template
A good starting point is to copy the plugin [InfoHub Rendermajor](plugin,infohub_rendermajor) and rename it.  
You could start the renderer name with "render" so it is easier to find, like infohub_rendermajor or infohub_renderadvancedlist, but that decision is entirely up to you.  
That plugin has everything you need and only one feature called "presentation_box". In your plugin you can add as many features you want, just add more internal functions.  
The renderer is a normal plugin, you need to have the functions _Version, and _GetCmdFunctions just like any plugin. In addition to that there are two other functions you need.  

# create
As you have learned by now, when you use a renderer you send the data to be rendered to [InfoHub Render](plugin,infohub_render).
Infohub_Render then call each renderer. It might be a child renderer or a level 1 renderer like infohub_rendermajor. Infohub_Render know that each renderar always have the cmd function "create".  
Infohub_Render only call a renderer if it has all the data needed for the renderer to perform its task.  
The data can look like this:  

```
'plugin': 'infohub_rendermajor',
'type': 'presentation_box',
'head_label': 'Lead words in building InfoHub',
'content_data': '[key_list_data]',
'open': 'true'
```

Now infohub_render knows that it has to call infohub_rendermajor and pass the data to its "create" function.  
The "create" function always looks the same in level 1 renderers. You can see it in infohub_rendermajor.  
First "create" takes the 'type', convert it to an internal camel case function name and call that internal function:  

```
$in.func = _GetFuncName($in.type);
var $response = internal_Cmd($in);
```

The response are sent to infohub_render for rendering to HTML. The HTML are returned to your renderer and added in the return call to infohub_render.  

# Get Func Name
The "create" function get your data and the 'type' parameter. 'type' is the name of your feature. For example: 'type': 'presentation_box'.
_GetFuncName convert 'presentation_box' to 'PresentationBox'. That is then used in internal_Cmd to call that function.  

# Your feature
Your feature, the internal function - Here you can do whatever you want. Just make sure your return call look like this:  

```
return {
    'answer': 'true',
    'message': 'Here are the parts to build the presentation box', // Custom message
    'data': $parts, // The parts you want to be rendered
    'how': {
        'mode': 'one box',
        'text': '[legend]' // The entry point of your data. Exchange 'legend' to what ever you use.
    },
    'where': {
        'mode': 'html' // This is important. This means that infohub_render should render HTML
    }
};
```

Make sure you use 'mode': 'html' so that Infohub Render return the HTML to your renderer.  
    
# Inspiration
Ok, so now you know how to use a renderer and you know how to create one for yourself. What can you do with all this? Here are some examples:  

- Graphs - different kinds of SVG graphs to present data
- Canvas - Use the canvas for 2d or 3d graphics
- Audio - Anything you can render to HTML, it does not have to be visual

Today you already get the built in renderers for audio, common, image, link, map, text, video. You will get forms and SVG. And you have the higher level renderers like rendermajor and renderadvancedlist.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2018-04-08 by Peter Lembke  
Updated 2018-04-08 by Peter Lembke  
