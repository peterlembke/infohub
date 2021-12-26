# Encoding

Today Infohub uses wrapper functions around json encode and json decode.

I want to support [msgPack](https://github.com/msgpack/msgpack-php) if it holds up to the promise of being faster than JSON and produce smaller serialisation than JSON.
Since Infohub heavily depend on object copy then msgPack could increase over all performance.

## PHP

The [msgpack-php](https://github.com/msgpack/msgpack-php) Phar plugin give you full support for msgpack in PHP.

## Javascript

Here we have a multitude of libraries. 

I need a single distribution file.
* HOT [ygoe/msgpack](https://github.com/ygoe/msgpack.js), [latest tag 2020](https://github.com/ygoe/msgpack.js/tags)
* COLD [creationix/msgpack](https://github.com/creationix/msgpack-js), [the latest tag 2013](https://github.com/creationix/msgpack-js/tags)
* COLD [kawanet/msgpack-lite](https://github.com/kawanet/msgpack-lite) and on [NPM](https://www.npmjs.com/package/msgpack-lite), [latest tag 2017](https://github.com/kawanet/msgpack-lite/tags)
* COLD [chakrit/msgpack-js](https://github.com/chakrit/msgpack-js) forked from creationix/msgpack. [NPM](https://www.npmjs.com/package/msgpack-js-v5), [the latest tag 2013](https://github.com/chakrit/msgpack-js/tags)
* HOT [mcollina/msgpack5](https://github.com/mcollina/msgpack5), [the latest release 2021](https://github.com/mcollina/msgpack5/releases), [NPM](https://www.npmjs.com/package/msgpack5)

Other implementations that do not have a single file
* HOT OFFICIAL [msgpack/msgpack-javascript](https://github.com/msgpack/msgpack-javascript), has a [browser example](https://github.com/msgpack/msgpack-javascript/blob/main/example/amd-example.html), [the latest release 2021](https://github.com/msgpack/msgpack-javascript/releases/tag/v2.7.1) 
* HOT [mprot/msgpack](https://github.com/mprot/msgpack-js), [the latest tag 2020](https://github.com/mprot/msgpack-js/tags)
* COLD [hypergeometric/notepack](https://github.com/hypergeometric/notepack), the latest release 2014

So we have 4 hot and 4 cold libraries.

## Usage

I can use msgPack for the object copy in JS if it is faster than _MiniClone() on copying objects in _ByVal().
I can measure the time in _ByVal() and see if it is better.
Right now it looks like a complicated way of copying an object.

I can use msgPack for the traffic between nodes if I do not have to add a base64 encoding on top.
With gzip compression the size is not a big problem. Sending data has one second penalty anyhow. 

I can use msgPack to store data to Storage.
There are no space problem in the Storage, so it is the conversion speed that matters. Storing data is slow by itself.
I will run most data through the encryption, and it has a built-in gzip-compression.

## Conclusion
A lot of work to test. I doubt that there will be any dramatic difference in perceived speed.

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2021-11-13 by Peter Lembke  
Updated 2021-11-21 by Peter Lembke  
