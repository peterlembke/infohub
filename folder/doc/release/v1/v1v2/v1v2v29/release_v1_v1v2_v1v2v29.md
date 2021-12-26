# [1.2.29] - 2021-01-09

Colour schema configuration updated. You can now name, download, upload, apply colour schemas. You can now preview the colour schema. Mocha chocolate is the default colour schema. Created some colour schemas you can use.
Your Css is now added at the end of the existing css if you use the same class name.

* [Release notes](main,release_v1_v1v2_v1v2v29)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.29)

## Known issues
* Colour config - not fully translated yet. Future version.
* Colour config - get_config does not work but are not used. Future version.
* Vagrant xdebug 3.0.1 not implemented. Next version. 

## Added
* HUB-1170, Submit colours. Check if anything has changed before saving
* HUB-1138, Infohub_Base -> _MergeStringData. Put together strings from two objects.
    To be used in css_data to merge css from two objects. Then you can override part of a css.
* HUB-1139, Use _MergeStringData in the renderers. So you can add more css to the default css.
    Modified the audio streaming demo for Jamendo to show the link in 1.5em instead of 1.0em.
    Modified the text demo to show the first letter in 2em and white colour.
    All infohub_render_ are modified. 
    RenderAdvancedList. RenderDocument are modified. High level renderers have some css that are fixed.  
* HUB-1155, configlocal_colour: Added a name input box so I can let you download your colour schema
* HUB-1172, configlocal_colour: Button to download schema
* HUB-1171, configlocal_colour: Button to upload schema
* HUB-1174, configlocal_colour: Add schema files
* HUB-1176, configlocal_colour: Preview. Render some example
* HUB-1181, configlocal_colour: Preview. Change the colour
* HUB-1185, Configlocal_Colour: Add a button icon
* HUB-1186, Configlocal_Colour: Get Preview working
* HUB-1184, Create some colour schemas.
    You find them in folder/config_example/colour_schema 

## Changed
* HUB-1167, Colour config: If no config then show the default one in the editor
* HUB-1157, Render full list in the background. This took too long time in older versions of Infohub, but now it is quick.
* HUB-1173, infohub_color: Use rgb() instead of # colours to avoid getting them replaced
* HUB-1177, configlocal_colour: Submit, refactor code
* HUB-1179, configlocal_colour: Upload does not work. It was a cache key problem on the layer 0,1,2 grey shade. 
* HUB-1178, configlocal_colour: Apply. Clear full render cache and reload. Modified the clear cache button to be an apply button.
    Moved some code to infohub_debug.
* HUB-1183, Fix button colour to not use the highlight colour  
* HUB-1188, configlocal_language: Gives error. It was the conversion I removed before.
* HUB-1190, configlocal_colour: Apply should submit as first step
* HUB-1191, Welcome: You can do all this - Images have no css

## Removed

## Fixed
* HUB-1182, configlocal_colour: Preview. Affects to submit. Avoid that.

## Tested

## Investigated
* HUB-1166, Investigate if I can modify all colours in the active HTML
    The modified HTML did not show the new colour and the form data was reset. I need another approach on this if I want it.
* HUB-1158, Cache the complete full list HTML.
  All this is possible but less wanted now when I update the list in the background + have a faster rendering. I will close this task.
* HUB-1156, Quicker restart with full page cache.
    FPC always give problems with data. I will implement web workers instead that increase rendering speed. I will close this task.
* HUB-1175, configlocal_colour: Download must save correct data. After I did HUB-1177 this fixed itself. Compared downloaded files OK.
* HUB-1180, infohub_render - create: Allow a color_lookup parameter for a colour schema used only for this rendering.
    The investigation showed that there will be special cases and more complications. I will use an override of the css
    and use rgb() colours.
