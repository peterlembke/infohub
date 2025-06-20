/*
 * Code comes from
 * https://developers.google.com/web/fundamentals/primers/service-workers/
 * License: "Except as otherwise noted, the content of this page is
 * licensed under the Creative Commons Attribution 3.0 License,
 * and code samples are licensed under the Apache 2.0 License.
 * For details, see our Site Policies."
 * https://developers.google.com/terms/site-policies
 * Uppdaterades senast februari 12, 2019.
 *
 * only minor modifications by Peter Lembke
 */

let $version = '2020-09-12';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('infohub').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.php',
                '/manifest.json',
                '/images/infohub-72.png',
                '/images/infohub-96.png',
                '/images/infohub-128.png',
                '/images/infohub-144.png',
                '/images/infohub-152.png',
                '/images/infohub-192.png',
                '/images/infohub-384.png',
                '/images/infohub-512.png',
                '/serviceworker.js'
            ]);
        })
    );
});

self.addEventListener('activate', function (event) {

    var cacheAllowlist = ['infohub'];

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheAllowlist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event)
{
    event.respondWith(caches.match(event.request).then(function (response) {
        // caches.match() always resolves
        // but in case of success response will have value
        if (response !== undefined) {
            return response;
        }

        return fetch(event.request).then(function (response)
        {
            if (event.request.method === 'POST') {
                return response;
            }

            // response may be used only once
            // we need to save a clone to put one copy in cache
            // and serve the second one

            let responseClone = response.clone();

            caches.open('infohub').then(function (cache) {
                cache.put(event.request, responseClone);
            });

            return response;

        }).catch(function () {
            // return caches.match('/index.php');
        });
    }));
});
//# sourceURL=serviceworker.js