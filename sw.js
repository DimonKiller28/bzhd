const CACHE_NAME = "bzhd-developer-v1";

// Список всех файлов, которые веб-сервер внутри браузера должен отдавать локально
const ASSETS = [
    "./",
    "./index.html",
    "./academy.html",
    "./tests.html",
    "./style.css",
    "./script.js",
    "./components/head.html",
    "./articles/hardware.html",
    "./articles/infrastructure.html",
    "./articles/environment.html",
    "./articles/software.html",
];

// Установка: принудительно заносим файлы в локальный кэш браузера
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting()),
    );
});

// Активация: заставляем скрипт контролировать страницу немедленно
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

// Перехват fetch-запросов: отдаем файлы напрямую из кэша браузера, минуя сетевые CORS-запреты
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }),
    );
});
