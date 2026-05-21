import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {}, // Add empty turbopack config to silence the error
};

const withPWA = isDevelopment
  ? (config: NextConfig) => config
  : nextPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      buildExcludes: [/middleware-manifest\.json$/, /_buildManifest\.js$/],
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "offlineCache",
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 86400 * 30, // 30 days
            },
          },
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "static-resources",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400 * 7, // 7 days
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 86400 * 30, // 30 days
            },
          },
        },
      ],
    });

export default withPWA(nextConfig);
