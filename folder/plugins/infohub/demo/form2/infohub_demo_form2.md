# Infohub Demo Form2
Shows a demo how you can use the plugin Infohub_RenderForm.  

# Introduction
In this demo we show how to use the infohub renderform plugin. [Infohub RenderForm](plugin,infohub_renderform)  
You will be shown an order form for a restaurant. If there are fields you need to fill in then they will be marked with a red frame.
When you have filled your order you can press submit.  

# Forms
When you have a form like this in your plugin then you must remember the way messages are allowed to travel. You can answer your parent. You get answers from your children. You can ask your siblings. You can answer your siblings.  
The form layout and the handler for the three buttons are in the child plugin infohub_demo_form2. This means that infohub_demo will ask the child for layout data and will also pass trough buttons clicks to the child.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2018-09-27 by Peter Lembke  
Updated 2018-09-27 by Peter Lembke  
