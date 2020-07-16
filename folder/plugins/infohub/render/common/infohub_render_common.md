# Infohub Render Common
Render common objects like containers, iframes (deprecated), legends, images, lists  

# Introduction
Each object this plugin can render is simple and commonly used.  

# Container
The container can be used when you want to wrap something in a div, span or p tag.  

```
<div name="my_container" class="a1202_my_container">
    <style scoped="">
        .a1202_my_container container { background-color: #b2de98; padding: 4px 4px 4px 4px; border: 12px solid #bdbdbd; }
    </style>
    <div id="1202_my_container" name="my_container" class="container" style="display: block">
    </div>
</div>
```

# Container start stop
You can wrap text with a div, p or span tag. You can add a class name. See this complete example below.  

```
return {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_text': {
                'type': 'text',
                'text': "This is the [light]highlighted part[/light] of the text."
            },
            'light': {
                'type': 'common',
                'subtype': 'containerStart',
                'class': 'light',
                'tag': 'span'
            },
            '/light': {
                'type': 'common',
                'subtype': 'containerStop',
                'tag': 'span'
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_text]'
        },
        'where': {
            'parent_box_id': 'main.body',
            'box_position': 'last',
            'box_alias': 'my_article',
            'max_width': 960
        }
    },
    'data_back': {'step': 'step_end'}
};
```

Here we have defined a start tag with a class, and an end tag. You then use these tags when you render a text.  
Why are the CSS code in "how" and not in "light"? The renderer for contanierStart is creating a span-tag. If we were wrapping CSS to that tag then an end tag would be inserted by the browser to complete the start tag.  

# iframe
Do not use iframes!! Do not use 3rd party services in iframes. Spare the browser from all this and let it get all data from the server instead. iframes prevent your app from working offline.  
Ok, nice said, not so easy done when you want to show a google map or a youtube video. Yes, those cases have their own renderers. Please use infohub_render_video and infohub_render_map.  
And even then it is not polite to just show an iframe. Embed the iframe by using infohub_rendermajor.  
So the usage for this function is other cases that not yet have its own renderer. And you still should (have to) embed the iframe in a rendermajor.  
In this example I will show you how to add a DuckDuckGo search box. You can see how the iframe can be defined <a href="https://duckduckgo.com/search_box">here</a>.  

<iframe src="https://duckduckgo.com/search.html?width=200&site=abc.se&prefill=Search ABC.se" style="overflow:hidden;margin:0;padding:0;width:258px;height:40px;" frameborder="0"></iframe>

After some testing with parameters I came up with this:  

```
return {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_iframe': {
                'type': 'common',
                'subtype': 'iframe',
                'alias': 'duckduckgo',
                'height': '40px',
                'class': 'container',
                'data': 'https://duckduckgo.com/search.html?site=abc.se&prefill=Search ABC.se&kn=1',
                'css_data': {}
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_iframe]'
        },
        'where': {
            'parent_box_id': 'main.body',
            'box_position': 'last',
            'box_alias': 'my_iframe',
            'max_width': 320
        }
    },
    'data_back': {'step': 'step_end'}
};
```

kn=1 means that I want the search results to show in a new browser page/tab.  
The result of this code is:  

![My image](duckduckgo.png)

The same result could easily be achieved by using the form plugin and ask the server for search results.  

# Legend
Legends are used when you want to box something with a nice frame and a good looking title.  

```
'a_legend': {
    'type': 'common',
    'subtype': 'legend',
    'alias': 'a_legend',
    'label': 'This is a legend',
    'data': 'This is the contents. As usual you can reference other objects [my_image] if you want to.[my_list]',
    'class': 'fieldset'
},
```

I have not added any "css_data" because you get a good looking hard coded set of data if you leave "css_data" blank.  
If you want your own css you can add 'css_data' to the definition above. Below is the hard coded css you get if you omit 'css_data'.  

```
'css_data': {
    'fieldset' : 'border: 1px solid #bcdebc; margin: 8px 4px 8px 4px; padding: 4px 4px 4px 4px; border-radius:10px;',
    'fieldset .legend': 'color: #000; border: 1px solid #a6c8a6; padding: 2px 13px; font-size: 1.0em; font-weight: bold; box-shadow: 0 0 0 0px #ddd; margin-left: 20px; border-radius: 20px;'
}
```

# Image
The image data is usually coming from infohub_asset. You can either use infohub_asset as in the example below, or you can embed the image yourself.  
If you embed your own image then the image must be base64 encoded. You can find services online that encode images to base64 text. Use png, jpeg or svg. They have the largest browser support.  
One of many pages that can convert an image to base64 is <a href="https://www.base64-image.de/" target="_BLANK">https://www.base64-image.de/</a>  

```
'my_image': {
    'type': 'common',
    'subtype': 'image',
    'data': '[my_image_asset]',
    'alias': 'my_image',
    'class': 'image',
    'css_data': {
        '.image': 'width:60px;height:60px;float:left;padding: 4px;'
    }
},
'my_image_asset': {
    'plugin': 'infohub_asset',
    'type': 'icon',
    'asset_name': 'common/image',
    'plugin_name': 'infohub_demo'
},
```

# List
Lists are for listing things under each other. You can also use lists for layout. In this example we just create a traditional list.  

```
'my_list': {
    'type': 'common',
    'subtype': 'list',
    'class': 'list',
    'option': [
        {'label': 'Does not track you' },
        {'label': 'Does not [u]sell[/u] you anything' },
        {'label': 'That is why I [:-)] like them' }
    ],
    'css_data': {
        '.list': 'background-color: green; list-style-type: square;list-style-position: inside;list-style-image: none;'
    }
},
```

You can reference other objects in the labels.  

# The big example
Here are an example that will show all features from the common plugin. Needless to say I am a backend developer and not a frontend developer.  
I want the result to look exactly like this:  
![My image](commonexample.png)
To achieve this small wonder we need to construct a message.  

```
return {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_container': {
                'type': 'common',
                'subtype': 'container',
                'alias': 'duckduckgo_container',
                'class': 'container',
                'tag': 'div', // span, p, div
                'data': 'Time:[light][time][/light][a_legend]',
                'visible': 'true',
                'css_data': {
                    '.container': 'background-color: #b2de98; padding: 4px 4px 4px 4px; border: 4px solid #bdbdbd;'
                }
            },
            'a_legend': {
                'type': 'common',
                'subtype': 'legend',
                'alias': 'a_legend',
                'label': 'This is a legend',
                'data': '[my_iframe][my_image][my_list]',
                'class': 'fieldset'
            },
            'my_iframe': {
                'type': 'common',
                'subtype': 'iframe',
                'alias': 'duckduckgo',
                'height': '40px',
                'class': 'iframe',
                'data': 'https://duckduckgo.com/search.html?site=abc.se&prefill=Search ABC.se&kn=1',
                'css_data': {
                    '.iframe': 'border: 2px solid #444444;'
                }
            },
            'light': {
                'type': 'common',
                'subtype': 'containerStart',
                'class': 'light',
                'tag': 'span'
            },
            '/light': {
                'type': 'common',
                'subtype': 'containerStop',
                'tag': 'span'
            },
            'my_list': {
                'type': 'common',
                'subtype': 'list',
                'class': 'list',
                'option': [
                    {'label': 'Does not track you' },
                    {'label': 'Does not [u]sell[/u] you anything' },
                    {'label': 'That is why I [:-)] like them' }
                ],
                'css_data': {
                    '.list': 'background-color: green; list-style-type: square;list-style-position: inside;list-style-image: none;'
                }
            },
            'my_image': {
                'type': 'common',
                'subtype': 'image',
                'data': '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',
                'alias': 'my_image',
                'class': 'image',
                'css_data': {
                    '.image': 'width:60px;height:60px;float:left;padding: 4px;'
                }
            },
            'time': {
                'type': 'common',
                'subtype': 'value',
                'data': _TimeStamp()
            }
        },
        'how': {
            'mode': 'one box',
            'text': 'Common demo. [my_container]',
            'css_data': {
                '.light': 'background-color: green; display: inline-block;'
            }
        },
        'where': {
            'parent_box_id': 'main.body',
            'box_position': 'last',
            'box_alias': 'duckduckgo_search',
            'max_width': 320
        }
    },
    'data_back': {'step': 'step_end'}
};
```

# Message structure
As usual we send the message to the renderer. In data we have the usual what (to render), how (to render it), where (to put the result).  
 _Where_ : As usual, where InfoHub View will create a box for this contents. In this case last in box with alias: "body".  
 _How_ : One box. Note that you can write anyting in "text" and that `[my_container]` is a reference to one of the items in "what". You can reference more items in "what" if you want to.  
And we also have "css_data" in "how". That is CSS you want to use within this box. Normally you put the CSS in each object but in this case we use "containerStart" that does not support css_data. More about that later.  
 _What_ : Read about what below. In "how" I reference `[my_container]`. That is your starting point.  
    
# What to render
You will notice that you can reference any defined object from anywhere. Just make sure you do not reference an object to itself creating an infinite loop.  
 _my_container_ : is a div-tag container that contain this: `'Time:[light][time][/light][a_legend]'`. It has its own CSS to give a grey border with a light green background.  
 _light_ : is a 'containerStart' span box with class "light". Since this is just the start tag then you can not wrap a CSS div box around it. That would give bad HTML. Instead the CSS have to be defined in the "how" section.  
 _time_ : This is a value that will be inserted as it is. In this case we call a function to get the value and we call the _TimeStamp() function.  
 _/light_ : the end span tag for "light".  
 _a_legend_ : is a fieldset with a legend title. It contains `'[my_iframe][my_image][my_list]'`. The CSS for the class names are not in the example. It should be.  
 _my_iframe_ : The DuckDuckGo service is referenced here.  
 _my_image_ : A logo from DuckDuckGo.  
 _my_list_ : A list with items. Note that you can use references in the texts. If you want the time here too then just write `[time]`.  
    
# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-09-22 by Peter Lembke  
