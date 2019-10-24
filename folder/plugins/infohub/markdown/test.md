# This is a h1 tag
## This is a h2 tag
### This is a h3 tag
#### This is a h4 tag
##### This is a h5 tag
###### This is a h6 tag

It's very easy to make some words **bold** and other words *italic* with Markdown.

*This text will be italic*

 _This will also be italic_

---

**This text will be bold**

 __This will also be bold__

 _You **can** combine them_

# Lists
## Unordered

* Item 1
* Item 2
  * Item 2a
  * Item 2b

## Ordered

1. Item 1
1. Item 2
1. Item 3
   1. Item 3a
   1. Item 3b

# Links

http://github.com - automatic!

[GitHub](http://github.com)

[Get Showdown!](https://github.com/showdownjs/showdown)

# Blockquotes

As Kanye West said:

> We're living the future so
> the present is our past.

# Inline code

I think you should use an 
`<addr>` element here instead.

# Syntax highlighting

```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
```

You can also simply indent your code by four spaces:

    function fancyAlert(arg) {
      if(arg) {
        $.facebox({div:'#foo'})
      }
    }

Here is an example of Python code without syntax highlighting:

    def foo():
        if not bar:
            return True

# My render engine in Infohub
I have [my_list] or [my_image] embedded in the text.

# Task Lists

 - [x] list syntax required (any unordered or ordered list supported)
 - [x] this is a complete item
 - [ ] this is an incomplete item

# Tables

You can create tables by assembling a list of words and dividing them with hyphens - (for the first row), and then separating each column with a pipe |:

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

# URLs
Any URL (like http://www.github.com/) will be automatically converted into a clickable link.

# Strikethrough

Any word wrapped with two tildes (like ~~this~~) will appear crossed out.

# Emoji
Some emoji :sparkles: :camel: :boom:

# Images
If you want to embed images, this is how you do it:

![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
