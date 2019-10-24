# Infohub Render Text
With render text you can put together different parts into one HTML.  

# Introduction
Plugin that render a text. All text rows get paragraph tags. If you provide a class name or use the default one ("text_article") then the text are wrapped with a div tag that have a unique id.
Om class name is "text_article" (default) then you will also get the default CSS so the text looks and acts like a text article with columns.  
The columns will be as many as needed to fill the page left to right. On a phone you get one column automatically.  

# Usage
You can see how the render text are used in the Infohub Demo. Here is a short example:  

```
$data = {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_text': {
                'type': 'text',
                'text': "[h1][titel][/h1]\n [i][ingress][/i]\n And I have more text here [:-)]."
            },
            'titel': {
                'type': 'common',
                'subtype': 'value',
                'data': 'Welcome to a short demo about text'
            },
            'ingress': {
                'type': 'common',
                'subtype': 'value',
                'data': 'Here are more text where I use [b]bold[/b] and [i]italic[/i] and even a line [line].'
            },
        },
        'how': {
            'mode': 'one box',
            'text': '[my_text]'
        },
        'where': {
            'box_id': $in.parent_box_id + '.demo',
            'max_width': 320,
            'scroll_to_box_id': 'true'
        }
    },
    'data_back': {
        'step': 'step_end'
    }
};
```

# Special characters
You can easily show special characters by adding these codes into your text.  

```
    [:-)] gives ☺
    [:-(] gives ☹
    [(c)] gives ©
    [(r)] gives ®
    [tel] gives ☏
    [eur] gives €
    [b] gives &lt;b&gt;
    [/b] gives &lt;/b&gt;
    [i] gives &lt;i&gt;
    [/i] gives &lt;/i&gt;
    [u] gives &lt;u&gt;
    [/u] gives &lt;/u&gt;
    [line] gives &lt;hr&gt;
    [columns] gives &lt;div class="text_columns"&gt;
    [/columns] gives &lt;/div&gt;
    [h1] gives &lt;h1&gt;
    [/h1] gives &lt;/h1&gt;
    [h2] gives &lt;h2&gt;
    [/h2] gives &lt;/h2&gt;
    [h3] gives &lt;h3&gt;
    [/h3] gives &lt;/h3&gt;
    [br] gives &lt;br&gt;'
```

# Add other elements
As you can see in the example above you can have other rendered parts inserted into the text. The example have "titel" and "ingress". These two will be rendered to HTML before they reach the text plugin, and they will be inserted into the text.  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2017-02-11 by Peter Lembke  
Updated 2018-10-12 by Peter Lembke  
