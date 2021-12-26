# [1.2.22] - 2020-08-22

Bugs found from last release. Added info about Infohub on Login page. Fixed rights. Added execution time and debug info. Added translations and translated Infohub Trigger. 

* [Release notes](main,release_v1_v1v2_v1v2v22)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.22)

## Added
* HUB-986, Login, added details what Infohub is. English, Swedish and Spanish Markdown text
    Also added config to customize the page
* HUB-987, Login, Make sure the Login GUI is in at least the browser language. In my case Swedish
* HUB-988, Login, The information text is in Swedish and the GUI is in english. Make sure the language come from localConfig
* HUB-991, Login, The Swedish text do not show proper åäö
    It was infohub_file that needed to treat Markdown .md files as text
* HUB-989, Login, Translate more texts
* HUB-990, Launcher, added missing translations
* Trigger, created translations for ES, EN, SV
* Base & Exchange - JS & PHP return execution_time
* Launcher, added debug_message to see what step took time to execute
* HUB-985, PayPal - ask for gift. Added to the Login links and to README.md
* Articles published in [new repository](https://github.com/peterlembke/infohub-articles#readme)

## Changed
* Infohub Translate now require the developer role
* Infohub Template now got status: emerging
* File, Read and Write now do not allow `..` and `~` in the paths
* HUB-993, Apply config - earlier
    Moved apply_config from Login to standalone.

## Removed

## Fixed
* HUB-980, User role: User - Have no rights to see the full list
    Had to modify folder/file/infohub_log in on infohub.se
* HUB-982, File give exception. Fixed that

## Tested
* HUB-981, Pi3 - Deploy the latest code and collect bug reports

## Investigated
* HUB-994, Launcher, my_list - shows slow. Not always. I'll close for now.
    render_list - added debug_message and execution_time
* HUB-981, Pi3 - Deploy the latest code and collect bug reports
