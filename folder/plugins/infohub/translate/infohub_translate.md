# Infohub Translate

The plugin you start will be in your preferred language because it calls Translate and get the language data. The plugin
is also a tool for creating language files. This document will describe how you do that.

## Preferred languages

You set your preferred languages in the preferred order in [Infohub ConfigLocal](plugin,infohub_configlocal).

## Assets

Plugins can have translation files in their assets, see [Infohub Asset](plugin,infohub_asset). The assets are downloaded
to the client when the plugin is used.

The plugin can ask Infohub_Translate for translation data and translate the texts before they are rendered and shown on
the screen.

## Create translation files

Pick a plugin name and create translation files. One key file and one file you will translate. Read more
here: [Infohub_Translate_Createfiles](plugin,infohub_translate_createfiles).

## Merge translation files

When you have translated the file you can now merge it with the key file to get the final file. Read more
here: [Infohub_Translate_Mergefiles](plugin,infohub_translate_mergefiles).

## Update translation files

You can update an existing language file with missing keys and then translate just those keys. Keys that no longer exist
in the plugin will be removed. Read more here: [Infohub_Translate_Updatefiles](plugin,infohub_translate_updatefiles).

## Use in your plugin

You have several examples how to use language files in your plugins. See infohub_demo, infohub_tools, infohub_welcome
and so on.

Add this to your plugins, yes your child plugins too:

```
    let $classTranslations = {};
```

### In your level 1 plugin

In your level 1 plugin in function `setup_gui` you have these steps:

```
        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response') {            
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_menu';
        }
```

And whenever you want to use a translation you use

```
_Translate('The string you want')
```

### Child plugins

The child plugin must get the translations. When you initialize the child plugin with function "create" or function "
start" or whatever you use you should also send the translations to the child.

```
    const $default = {
        'parent_box_id': '',
        'translations': {},
        'step': 'step_start',
        'response': {
            'answer': 'false',
            'message': 'Nothing to report from infohub_demo_common'
        }
    };
    $in = _Default($default, $in);

    if ($in.step === 'step_start') 
    {
        $classTranslations = $in.translations;
```

And then use the translations as usual. Do remember to read the first section above: "Use in your plugin".

## Icons and descriptions

The icon title and the description that you find in asset/launcher.json can be translated by adding this in your
translation files:

```
    },
    "launcher": {
        "title": "Translate",
        "description": "Create template files that you can translate"
    },
    "data": {
```

See how this is done in the plugins infohub_demo, infohub_tools etc.

## License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Updated 2019-11-01 by Peter Lembke Since 2019-03-14 by Peter Lembke  
