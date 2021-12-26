# Infohub Libre Translate

You can use Libre Translate for your translation needs. It provides a graphical user interface for manual translations.
And a level 1 function that will translate a lot of text for you.

In the background it calls the server that calls the LibreTranslate service.

# Test the access

You can run wget to see if LibreTranslate answer.
```
wget -O test.json https://libretranslate.com/languages
cat test.json
```

Then test your Docker box 
```
wget -O test.json http://0.0.0.0:5050/languages
cat test.json
```
And then test inside your App Docker box that it can reach the LibreTranslate Docker box. 
```
dox shell app root 
wget -O test.json http://translate:5000/languages
cat test.json
```

# Use in your plugin

## Get the language list
```
return _SubCall({
    'to': {
        'node': 'server',
        'plugin': 'infohub_libretranslate',
        'function': 'get_language_option_list',
    },
    'data': {
        'selected': $in.selected
    },
    'data_back': {
        'step': 'step_store_in_cache',
        'selected': $in.selected,
        'use_cache': $in.use_cache
    }
});
```

## Translate a phrase
```
return _SubCall({
    'to': {
        'node': 'server',
        'plugin': 'infohub_libretranslate',
        'function': 'translate',
    },
    'data': {
        'from_language': $in.from_language,
        'to_language': $in.to_language,
        'from_text': $in.from_text
    },
    'data_back': {
        'step': 'step_end'
    }
}); 
```

## License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Updated 2021-10-07 by Peter Lembke 
Since 2021-09-16 by Peter Lembke  
