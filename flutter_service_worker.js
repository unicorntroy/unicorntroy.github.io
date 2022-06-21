'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "1ec1539cecb032646b636a656ad03042",
"assets/assets/images/Clientale/client-01.png": "e0241406f4f99d2bc2f7a36cd9c4490f",
"assets/assets/images/Clientale/client-03.png": "2dc098b6669e31f1789c8617fe207694",
"assets/assets/images/Clientale/client-02.png": "89abbc37faec979a1f872dff2e137120",
"assets/assets/images/Clientale/client-07.png": "fcb2c8ca6de6823540590bd42db05fe3",
"assets/assets/images/Clientale/client-04.png": "6d4f6aa65e9e292820eb22a37af50a26",
"assets/assets/images/Clientale/client-08.png": "47d9f2f76757462db3b3c858c58b87b0",
"assets/assets/images/Clientale/client-06.png": "18aa089b4e2f79f6fc169cf1a6daece9",
"assets/assets/images/Clientale/client-05.png": "c393c48f7b7c66b1a14fcfc10c75bfb9",
"assets/assets/images/Clientale/client-10.png": "8c35af51c9c705c9f3b46228e4c6f7dc",
"assets/assets/images/Clientale/client-09.png": "0b7ce8d7fe6a0bde9282e01c32e2aeaa",
"assets/assets/images/Clientale/client-11.png": "bbc80c3765d2898326589010579f8afb",
"assets/assets/images/Clientale/client-12.png": "c0e927b230fa6decbcc53bd543498a6f",
"assets/assets/images/Clientale/client-13.png": "e0fc2d2f0e50d52197e82464483435d0",
"assets/assets/images/Clientale/client-15.png": "c674ebe1a989e5b6b677b1a965e3e84b",
"assets/assets/images/Clientale/client-17.png": "eef83a75cc8b021f67656c541b399b76",
"assets/assets/images/Clientale/client-14.png": "5703f5964290ae82b87f31ade5011046",
"assets/assets/images/Clientale/client-16.png": "7bf87fcb66c23ca8ea3adfdc4b26759d",
"assets/assets/images/Clientale/client-18.png": "b30ff7148894143d398b76223a17bf8d",
"assets/assets/images/Product/product-a1.jpg": "17a0607d710b480ddd7c33163e05ae77",
"assets/assets/images/Product/product-a2.jpg": "85563280ecad4197355b7fd7ef234c0c",
"assets/assets/images/Product/product-a4.jpg": "6c142d913b826637a0945e78e17d0e91",
"assets/assets/images/Product/product-a3.jpg": "3c30db1cedffbfb0bb97f0ca77731b39",
"assets/assets/images/Product/product-a5.jpg": "021241b83ce1b422ffc5dff13b918447",
"assets/assets/images/logo.jpg": "8d3c2a4ab7c40075ba02b56e58496edd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/youtube_player_flutter/assets/speedometer.webp": "50448630e948b5b3998ae5a5d112622b",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/AssetManifest.json": "77303a4f2d377705b23f766f27426f96",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/NOTICES": "19acc9df92df654761d18649f238c696",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "8e648f9956608b86b18f9de6820a8779",
"/": "8e648f9956608b86b18f9de6820a8779",
"main.dart.js": "555940a0171adcb67a1caffc13df1b19",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"manifest.json": "dcfbf86af9aa64c3bb23e4a09a6a742b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
