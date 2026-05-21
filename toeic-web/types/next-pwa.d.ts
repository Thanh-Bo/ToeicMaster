declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface NextPWAOptions {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    buildExcludes?: RegExp[];
    runtimeCaching?: unknown[];
  }

  export default function nextPWA(options: NextPWAOptions): (
    config: NextConfig,
  ) => NextConfig;
}
