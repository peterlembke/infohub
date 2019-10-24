/*
 Copyright (C) 2010- Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 InfoHub is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 InfoHub is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with InfoHub.  If not, see <https://www.gnu.org/licenses/>.'
 */
// sanity_check
window.setInterval("sanity_check()", 5000);

function sanity_check()
{
    "use strict";

    let $value, $parent, $tagName, $url, $id, $box,
        $externalReferences = {'img': 0, 'a': 0, 'script': 0, 'iframe': 0, 'link': 0 },
        $found = 'false', $parts, $sandbox,
        $message = "", $display = 'none', $hrefPart;

    let $currentUrl = document.location.href;
    let $validUrl = $currentUrl + '#';

    let $elements = document.getElementsByTagName('img');
    for(let $i = 0; $i < $elements.length; $i++) {
        if ($elements[$i].src.substring(0,10) !== 'data:image') {
            $externalReferences.img++;
            $found = 'true';
        }
    }

    $elements = document.getElementsByTagName('a');
    if ($elements.length > 0)
    {
        $parts = $currentUrl.split('#');
        if (typeof $parts[0] !== 'undefined') {
            $validUrl = $parts[0];
        }

        for (let $i = 0; $i < $elements.length; $i++)
        {
            if ($elements[$i].href === '') { continue; }
            if ($elements[$i].href === 'javascript:void(0)') { continue; }

            $url =  $elements[$i].href;
            if ($url === '#') { continue; }
            if ($url === $currentUrl) { continue; }
            if ($url === $validUrl) { continue; }

            $parts = $url.split('#');
            if (typeof $parts[0] !== 'undefined') {
                if ($validUrl === $parts[0]) { continue; }
            }

            if ($url.substr(0,4) === 'http') {
                if ($elements[$i].target === '_blank') { continue; }
            }

            $externalReferences.a++;
            $found = 'true';
        }
    }

    $elements = document.getElementsByTagName('script');
    if ($elements.length > 0) {
        for (let $i = 0; $i < $elements.length; $i++) {
            if ($elements[$i].src !== '') {
                $externalReferences.script++;
                $found = 'true';
            }
        }
    }

    $elements = document.getElementsByTagName('iframe');
    if ($elements.length > 0) {
        for (let $i = 0; $i < $elements.length; $i++) {
            $parent = $elements[$i].parentNode;
            $tagName = $parent.tagName.toLowerCase();

            if ($tagName !== 'div' && $tagName !== 'span') {
                $externalReferences.iframe++;
                $found = 'true';
                continue;
            }

            $sandbox = $elements[$i].getAttribute('sandbox');
            if (!$sandbox) { // If sandbox attribute do not exist then it is a failure
                $externalReferences.iframe++;
                $found = 'true';
                continue;
            }

            /*
            $id = $parent.getAttribute('id') + '_iframe';
            if ($id !== $elements[$i].id) {
                $externalReferences.iframe++;
                $found = 'true';
                continue;
            }
            */

        }
    }

    $elements = document.getElementsByTagName('link');
    if ($elements.length > 0) {
        for (let $i = 0; $i < $elements.length; $i++) {
            if ($elements[$i].href !== '') {
                if ($elements[$i].href.substring(0,5) !== 'data:') {
                    $hrefPart = $elements[$i].href.substring( $elements[$i].href.length -'manifest.json'.length );
                    if ($hrefPart !== 'manifest.json') {
                        $externalReferences.link++;
                        $found = 'true';
                    }
                }
            }
        }
    }

    if ($found === 'true') {
        for (let $key in $externalReferences) {
            $value = $externalReferences[$key];
            if ($value > 0) {
                $message = $message + 'Type: ' + $key + ", quantity: " + $value + "\n";
            }
        }
        $message = "Sanity check\nFound external references\nInfoHub should not have external references\n" + $message;
        $display = 'block';
    }
    
    $box = document.getElementById('sanity');
    $box.innerHTML = $message;
    $box.style.display = $display;

}
//# sourceURL=sanity_check.js
