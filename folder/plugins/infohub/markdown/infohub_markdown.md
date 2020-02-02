# Infohub Markdown
Markdown is a text file format that are easily readable by humans and parsable by software so the text can be enghanced.
 The Markdown plugin uses three different child renderers that can render Markdown to HTML.
 You can choose any of them to render your text.

## Infohub Doc format
Markdown is the document format to use in Infohub. The extension on the Markdown files should be "md".
 Each plugin must have a Markdown documentation file.

## How to use
You can see how Markdown can be used in plugin infohub_demo_markdown

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_markdown': {
                'plugin': 'infohub_markdown',
                'type': 'showdown', // Type of renderer, skip to get default
                'text': $in.text
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_markdown]'
        },
        'where': {
            'box_id': $in.box_id + '_my_result_box',
            'max_width': 960,
            'scroll_to_box_id': 'true'
        }
    },
    'data_back': {
        'step': 'step_render_html_response'
    }
});
```

## Supported types
There are some well known libraries that convert Markdown to HTML and they are included as child plugins here.
* [Marked](plugin,infohub_markdown_marked) 
* [Remarkable](plugin,infohub_markdown_remarkable) 
* [Showdown](plugin,infohub_markdown_showdown)
* [Infohub](plugin,infohub_markdown_own)
Each of them are really good and have different strengths. That is why I did not just settle for one.  

## Documentation rendering
There is another plugin called [infohub_renderdocument](plugin,infohub_renderdocument).
This plugin are used when rendering the documentation. It is based totally on the renderers that are in Infohub. It is fast and flexible. You can review that as an alternative to you Markdown rendering.  

## More about Markdown in general
Links to information about Markdown in general.
* [Github features](https://guides.github.com/features/mastering-markdown/)
* [Markdown guide](https://www.markdownguide.org/cheat-sheet/)
* [Github gfm](https://github.github.com/gfm/)
* [Showdown - tables](http://demo.showdownjs.com/#!#tables)
* [Showdown](https://github.com/showdownjs/showdown)
