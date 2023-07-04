# [1.2.28] - 2020-12-31

Colour schema configuration. Mocha chocolate default colour schema.

* [Release notes](main,release_v1_v1v2_v1v2v28)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.28)

## Known issues

## Added
* HUB-1126, infohub_configlocal_colour - Button to get the selected gray scale
* HUB-1127, infohub_configlocal_colour - save dark mode
* HUB-1040, infohub_configlocal_colour - form load, show selected grey scale
* HUB-1128, Selected colours - Apply button that trigger `apply_config`
* HUB-1132, configlocal_colour -> apply_config send the configuration to infohub_render
* HUB-1136, infohub_render -> set_color_schema
* HUB-1141, Add the sixth colour selector. This time for Layer 2: Text titles
* HUB-1149, infohub_configlocal_colour: Add light bar to each layer
* HUB-1143, infohub_render: substitute colours
* HUB-1150, infohub_view: set_style_rule, finish this function
  Also fixed the input text background issues.
* HUB-1151, infohub_render: Use set_style_rule to set h1-h6 color
* HUB-1160, Colour: On load, populate the hidden value boxes
* HUB-1042, infohub_color, calculate the colour array
* HUB-1135, configlocal_colour -> submit: Ask infohub_color to calculate the color array and then save it too
* HUB-1162, Range: Set right colour from the schema

## Changed
* HUB-1121, infohub_configlocal_colour - Selected Grey scale must be separate and distinct.
* HUB-1124, infohub_configlocal_colour - Selected colour bar must be distinct
* HUB-1126, infohub_configlocal_colour - Render selected colours with a border
* HUB-1130, When I save the colour schema in the configlocal I want to recommend clearing the render cache in the success message.
* HUB-1131, Change Apply button to a render cache clear button
* HUB-1142, Change all hard coded css to use the new colours
* HUB-1152, Move more things from infohub_global.css
  Select css is moved from infohub_global.css to the select renderer.
* HUB-1161, Set a mocha chocolate default colour schema

## Removed
* HUB-1133, infohub_configlocal->color->apply_config: Remove the function
* HUB-1145, infohub_demo_common: Remove use of colour in css
* HUB-1146, infohub_workbench: Remove use of colour in css
    I did not remove. The high level renderers need to set css_data with colour sometimes.
* HUB-1148, Config files: Remove use of colour data in config files
* HUB-1152, Move more things from infohub_global.css. Copied the progress css to infohub_render_common
* HUB-1159, Contact: Fix select background colour. Removed custom css.
* HUB-1163, Prevent mobile to zoom the input boxes in a [more modern way](https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone)
* HUB-1164, Remove global css for Range

## Fixed
* HUB-1153, make InfoHub work on Firefox as it used to
    Also fixed progress colours to be equal on Brave (Chromium) and Firefox. 
* HUB-1165, Fix text and textarea text colour on Firefox  

## Tested

## Investigated
* HUB-1140, Plan the colour schema. What should get what colour.
* HUB-1144, Investigation: List all places where hardcoded colours are set
* HUB-1134, Create a hard coded colour schema
