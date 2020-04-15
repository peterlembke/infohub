# Extend Magento with InfoHub
Magento 2 (M2) and InfoHub will be the best of buddies, and this is the plan:  

# InfoHub use the M2 API (API mode)
The plugin InfoHub_Magento uses the M2 REST api to get data from M2 and give data to M2.  
This is useful if you do not want to install anything on M2 or if you just enjoy the REST API more than using dependency injections.  

# InfoHub inside M2 (Native mode)
InfoHub as an M2 module. Now InfoHub work inside M2 and provide an event interface so you can send messages to InfoHub trough the normal M2 events.  
You can now use all InfoHub features from InfoHub directly in your M2 modules. The built in InfoHub can also act as a node and send messages to other nodes that you define. Your M2 installation can then become part of a bigger InfoHub network.  

# InfoHub as a frontend to M2
InfoHub can be used with infohub_magento in API mode to have an extra frontend to the normal M2 frontend. You can then see how much sales both interfaces give you.  
You set up a separate InfoHub installation and install plugin infohub_webshop. The webshop provide the basic functions for a webshop and you can reroute the data requests to infohub_magento  
InfoHub will be what the customers see. With the rendering in the browser, and sharing of data between browsers, you get a super fast frontend on all devices.  
Infohub PHP Core will handle the communication with M2, and the Javascript Browser Core will provide the visual parts.  
With InfoHub as a frontend you can zoom in infinitely, you can select a color schema and a font that suite your sight.  
Since InfoHub only support touch and keyboard and keypad then it is easier to navigate. Nothing will overlay and nothing will trigger on hover.  
Perhaps your preferred user interface is audio and a game pad, then you use that.  

# InfoHub as an integration hub
An integration hub is a neutral point that have interfaces to importers and exporters. With an integration hub you have importers and exporters. If you export data from your product data program to files, then you can import that data to the hub. Then you select an exporter, perhaps export to Magento, that will receive the data.  
If you later want to change any of the systems then you change the importer or the exporter. This means that the integration can be reused.  
Infohub read import files and put the data in queues. The queues are imported and the data are sent to the M2 REST API.  
A new module in M2 provide a REST API for the features that can not be reached trough the normal API, like effective exports from M2 without polling.  

# InfoHub as a 3rd party service to M2
M2 uses InfoHub as a REST API service that provide something. InfoHub Callback (Just as REST) is used to provide the data that M2 want.  

# Hybrid usage
If the InfoHub is built in into M2 then you can ask InfoHub things, but you can also let InfoHub render HTML and use that in templates.  

# Static files
A Magento module that export product data and category data to static files in JSON format. These files can then be used by a Javascript frontend to render a page locally.  
It is possible to write a custom template in M2 that show a product page with data from a JSON file, but it is easier to do that in InfoHub.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2017-07-12 by Peter Lembke  
Updated 2017-07-12 by Peter Lembke  
