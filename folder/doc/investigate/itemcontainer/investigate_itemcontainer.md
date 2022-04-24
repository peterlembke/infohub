# Investigate - Drag and drop

A drag and drop container that can list any items. You can rearrange the items with drag-n-drop within the container.
You can remove an item. You can add an item from a template item.
You can drag an item to another drag and drop container and drop it there.

## Useful for

This container would be useful in Infohub LocalConfig when setting wanted languages in a specific order.
Useful in GUI designer to link and rearrange objects in a container and in the main list.
For creating a planner that looks like Trello or Jira.

## Drag and drop in general

Drag and drop is built into the web standards.

See [W3Schools drag and drop](https://www.w3schools.com/HTML/html5_draganddrop.asp)
And [W3Schools insertbefore](https://www.w3schools.com/jsref/met_node_insertbefore.asp)

## Lab 1
I have created a Lab with a list of div boxes. They can be rearranged within the box.
While you drag the item it will also move up or down in the list.

My lab also has a "remove" area where items can be dropped and removed.
My lab has a hidden template item that can be added to the list with an add-button.

I want more than one drag and drop container to work independently on the screen.
The user will only be able to drag and drop one item at the time.

I want it to be possible to drag an item from one container to another container.

## Lab 2
I want more than one container to coexist. That is the next lab.

## Lab 3
Drag items between containers.

## Config of the container

You set the config when you render the container. 

* Allow drag up - false, true (default)
* Allow drag down - false, true (default)
* Render remove area - false (default), true
* Render add button - false (default), true 
  * Requires that you render a template item
* Add where - first, last (default)
* Allow external item from containers - array with container IDs
* Add external where - nowhere (default), first, last, before, after
* Remove item dragged to other container - false (default), true

## Implementation

### New plugin
The drag and drop feature require its own renderer. It also requires some help from infohub_view.
infohub_draganddrop

### Implement the lab 1
First I just need to implement the basic lab results with a list and dragging up and down.
Implement the remove area.
Implement the add-button and the template item. 

### Implement the lab 2
Be able to have many containers that do not interfer with each other.

### Implement the lab 3
Be able to drag items to other containers.

# License
This documentation is copyright (C) 2022 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2022-04-13 by Peter Lembke  
Updated 2022-04-18 by Peter Lembke  
