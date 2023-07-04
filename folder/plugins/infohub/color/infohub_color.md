# infohub_color

I want to improve the colour templating in InfoHub and learn more about colours.

I have read a great [article](https://www.smashingmagazine.com/2020/08/application-color-schemes-css-custom-properties/)
about that and got inspired of its [example](https://codepen.io/smashingmag/pen/LYNEXdw). I also tested
the [colour tool](https://paletton.com/#uid=74H0X0kllllaFw0g0qFpxgxw0aF) that are mentioned.

# My plan

## Colour series (s)

Define four series of color shades: s0, s1, s2, s3

Each series get a primary colour and calculate 5 darker and 5 lighter tones. 11 colours in total. c0 to c10 where:

* c0 is dark but not black,
* c5 is the primary colour,
* c10 is light but not white.

## Colour groups (g)

Create five colour groups. g0, g1, g2, g3, g4.

* g0 is picking dark colours, base shade c1
* g1 is medium dark, base shade c3
* g2 is neutral, base shade c5
* g3 is medium light, base shade c7
* g4 is light, base shade c9

Might test g3 as a reverted g1.  
Might test g4 as a reverted g0.

## Colour group items

In each group pick one colour c0-c10 for each item.

* background - always the same as base shade in the group
* back = background + 4
* front = back + 4
* back-hover = back + 1
* front-hover = front + 1
* back-focus = back + 2
* front-focus = front + 2
* back-disabled = back + 3
* front-disabled = front + 3
* border = back +2
* shadow = back + 3

If colour number > 10 then number = number -10

## User config

I will provide four default base colours and set the group to g2 neutral.  
The user can change the four primary colours and the group.

If the user have not selected any group then: g2 is default unless the user have enabled dark mode in the browser then
g0 is default.

If you change the baseColours, or the groupName in the configuration then you must save the settings and refresh. I will
not change the colours on the fly.

The configuration will be in ConfigLocal. When we save the configuration then the groupName and baseColors are sent to
infohub_color that will calculate the colours if needed and save the array to the Storage.

If someone is asking for the array and infohub_color can not find any array in Storage then it will return a standard array
and totally ignore the ConfigLocal settings. You will have to save the settings again in ConfigLocal.

The colour series can be calculated from the HSL value with
a [javascript function](https://gist.github.com/vahidk/05184faf3d92a0aa1b46aeaa93b07786).

## How it works

If InfoHub Render do not have the color data it will ask infohub_color for it. infohub_color return a pre-calculated
array to infohub_render:

```  
{
    "s0": {
        "background": "#998877",
        "back": "#123123",
        "front": "",
        "back-hover": "",
        "front-hover": "",
        "back-focus": "",
        "front-focus": "",
        "back-disabled": "", 
        "front-disabled": "", 
        "border": "",
        "shadow": ""
    },
    "s1": {
        "background": "#998877",
        "back": "#123123",
        "front": "",
        "back-hover": "",
        "front-hover": "",
        "back-focus": "",
        "front-focus": "",
        "back-disabled": "", 
        "front-disabled": "", 
        "border": "",
        "shadow": ""
    },
    "s2": {
        "background": "#998877",
        "back": "#123123",
        "front": "",
        "back-hover": "",
        "front-hover": "",
        "back-focus": "",
        "front-focus": "",
        "back-disabled": "", 
        "front-disabled": "", 
        "border": "",
        "shadow": ""
    },
    "s3": {
        "background": "#998877",
        "back": "#123123",
        "front": "",
        "back-hover": "",
        "front-hover": "",
        "back-focus": "",
        "front-focus": "",
        "back-disabled": "", 
        "front-disabled": "", 
        "border": "",
        "shadow": ""
    }
}
InfoHub_Render now parse the final HTML and insert colours from the array:
```  

const $color = _GetData({
'name': 's2/back',
'default': '#999999',
'data': $colorData });

```
All occations are substituted at the same time.

# Tasks
What things I need:
* infohub_configlocal, need a configuration for color
* infohub_color, create plugin, do the calculations to an array and save
* infohub_render, ask infohub_color for the array
* infohub_render, substitute color information in the final html.
