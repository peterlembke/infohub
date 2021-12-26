# Infohub ConfigLocal Image

Configure how you want assets to be downloaded.

# Introduction

Different browsers have different capabilities what image types they can show. Different users have different needs on
their different devices. Perhaps you can download more at home on broad band and less on your phone when you are on the
go. Mobile phones usually has a quota how much you are allowed to download.

The configuration is not perfect and will not cover even the most basic use cases, but it is a start at least.

All configuration are stored locally in the local Storage and applied to the client configuration stored in the asset
plugin.

# The configuration screen

* Download assets - You can prevent all images and sounds to be downloaded. Save download time and quota
* Max asset size - Max asset size in Kilobytes you allow to be downloaded. You can limit to save download speed and
  quota
* Cache time for assets - Asset is considered fresh until this many days have passed. Then we will contact the server
  and see if it has been updated
* Image types you can see - Different browsers support different image formats. Select the image types you can see, and I
  will avoid downloading images you can't see on this browser

# Use cases

On your stationary computer and all other devices you have connected to your broad band you might want to download
assets, big assets too, low cache time - perhaps a week.

On your phone you might have broad band, and then you might want to download assets, medium size assets too, medium cache
time - perhaps two weeks.

If you want to reduce the quota on your phone to the essentials then you could download assets, set a maximum of 100Kb,
long cache time four weeks. Only mark SVG and do not mark the other image types.

And if you want to have the absolute minimum then disable download of assets. You can still use the assets you have
already downloaded.

## Advanced use cases

Depending on how this configuration is used there might be improvements in the future.  
Perhaps a dropdown where you can quickly select a pre-defined configuration.

* Large - Download all assets
* Medium - Download icons and medium size assets
* Low - Download icons only
* Stop - Download no more assets

# asset types

Not all file formats are suitable in the assets. Here is a list. Do remember that all assets for image, audio, video
need a license file.  
The below formats work well in all supported browser.

* SVG - scalable vector graphics. Recommended for all icons and illustrations.
* JPEG - old and common image format, lossy. Recommended for photos.
* PNG - free and common image format for lossless images. Recommended when details are very important.
* ogg/opus - open audio format with the best compression for all usage from low bit rate speech to high bit rate music.
  Recommended for all audio
* ogg/vorbis - open audio format with similar compression as mp3. Use opus.
* mp3 - old but common audio format. Use opus.  
  There might be other asset types like video, but we will come to that in a revision of this document.
* webp - can be used in [these browsers](https://caniuse.com/?search=webp)
* [avif](https://netflixtechblog.com/avif-for-next-generation-image-coding-b1d75675fe4) - can be used
  in [these browsers](https://caniuse.com/avif) and
  be [activated in Firefox](https://geekermag.com/open-avif-files-in-firefox/)

In the future all images will be AVIF. It superseded all other image formats.

- [Infohub Render Link](plugin,infohub_render_link)
- [Infohub Asset](plugin,infohub_asset)

# License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2020-09-23 by Peter Lembke  
Updated 2020-09-23 by Peter Lembke  
