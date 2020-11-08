# Infohub Storage Data File
Stores data in a file structure on the persistent storage  

# Introduction
InfoHub do not handle files. All data are in databases. How can you then import files to the databases? You can upload files from a browser.  
You can place the files on the server and then read them as a normal database. Then you can transfer the files to another database type.  
<a href="https://en.wikipedia.org/wiki/File_system" target="_blank">FILE</a> is one of the supported methods that Storage can use.  
FILE is your file system on your hard drive. Used for big files and for importing file data. You already have a file system, no installation. Most people know how to use a file system with files and folders.  

# Installation
__In Ubuntu and MacOS__ just make sure that PHP have read/write rights to folder/db/file  
__In Windows__ If it does not work then look on the internet  

# Setup
No setup. The required folders will be created if PHP have rights  

# How it works
Each folder is a bubble. Sub folders and XML files are children. main.xml contain the data in the folder  
When you read a folder then you get the data from main.xml, all other xml files and sub folders are listed as children. You also get meta information about the folder you are reading, like name.  
When you read an XML file then you get the file meta data (size, dates, name, extension) and the contents. The file have no children. If you also have a binary file with the same name then that data will also be read.  

# You can
Create a folder like 20170603-StockholmMarathon and put a main.xml in there telling about the event. Place all your images in this folder.  
Create an xml file for each image and fill it with information about the image, things like title, text, who is in the image, license information.  
In your main.xml you can write about the event and then reference to other xml files in the same folder.  

# Open format
There is a difference between [open file formats](en.wikipedia.org/wiki/Open_format) and file formats that are free to use. Please do not use free to use or closed file formats with Infohub. Instead use open file formats.  
Being open is not enough, it must also be good and have support in the major web browsers (Chromium, Firefox, Opera). A major web browser must exist on all major operating systems (Linux, OSX, Windows, Android, IOS)  

# Data file types - your data
You can import these data formats: .json .xml .csv. Encoding must be UTF-8.  
- XML - Clean XML without parameters in the tags and formed as a list. Each item will be a new bubble in the storage. Make it pretty for reading.  
- JSON - The whole file content is one json formed as a list. Each item will be a bubble in the storage. Make it pretty for reading.  
- CSV - This format is used when you have a lot of data where each post is identically structured. Not very human friendly to read without a tool. First line contain the field names. Each row will be a bubble in the database. Strings in double quotation, separate by comma.  

# Data file types - from open source
Data files that are created from software. Always make sure tha you use open source software that produce open file formats.  
One example: If you want to store GPS tracking data then you can use <a href="https://en.wikipedia.org/wiki/GPS_Exchange_Format" target_="_blank">GPX</a>.  
And as always, simplicity is king. If you view the binary file in a text editor and understand the structure then the file format is extra good.  

# Data file types - proprietary formats
Infohub will not stop you if you use proprietary formats. Proprietary formats risk to be unreadable in the future by you when you no longer have a license to the software that created them. Proprietary formats are also useless to people that do not run the specific software you used to create the file. Therefore, using open source is not enough you must also use an open format that can be read in many different software programs on the major operating systems.  
Examples: Word, Excel, Powerpoint. Instead use <a href="https://en.wikipedia.org/wiki/OpenDocument" target_="_blank">OpenDocument</a>  

# Binary files
You can read any binary file. A binary file is for example an image, audio, video.  
The data you get will be encoded to BASE64. Make sure your binary data are less than 16 Mb after encoding to BASE64. When your binary file are encoded to BASE64 then it requires another 1/3 of space. So the recommended largest binary file is 12Mb but you also need some bytes for the structure in the bubble, therefore 11,9Mb is maximum  

# License - contents
The contents in the image, audio, video require a license. If you are the author then you can select the license you want for your material.  
If you download material from the internet then you also need to copy the license and attach that to the media file in the database.  
Only use material that you know that you are allowed to use. There must be a reference to a valid license. The license data will be used in Infohub to show credits for all material you use on the page.  

# Image file types
Recommended image binary files.  
- JPEG - lossy file format. For photographs. Closed format. Only format with a broad support in major browsers. There are better open formats (JPEG2000, WebP) but they are not supported in the major browsers.  
- PNG - lossless file format. For icons and graphics. Well supported in the major browsers.  
- SVG - vector file format. For scalable graphics. Use this format instead of PNG if possible. Basic support in the major browsers.  

# Audio file types
Recommended audio binary files. One famous and popular format is mp3, it is a closed format and there are better and open alternatives.  
- Ogg Opus - The best audio format, it is good in all frequencies and much better than mp3. Broad support in the major browsers. Use this format for all audio.  
- Ogg Vorbis - Same as MP3 but an open format. Useful for the same frequencies as MP3. Broad support in the major browsers.  

# Video file types
Ogg Theora - Open format. Gives very good quality in small video files. Broad support in major browsers.  

# Import / Export
You can read the files and put them in other database engines. Just make sure that you do not fill up the databases with large binaries if you do not have to. Images can be much less bulky and tailored for your needs.  
You can restore the original files by reading them from a database and save them to the file storage.  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-08-19 by Peter Lembke  
Updated 2020-10-03 by Peter Lembke  
