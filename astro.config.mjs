// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://villaokinawa.com',
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'zh', 'en', 'zh-Hant', 'ko', 'th', 'hi', 'fr', 'de', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          ja: 'ja-JP',
          zh: 'zh-Hans',
          en: 'en-US',
          'zh-Hant': 'zh-Hant',
          ko: 'ko-KR',
          th: 'th-TH',
          hi: 'hi-IN',
          fr: 'fr-FR',
          de: 'de-DE',
          es: 'es-ES',
        },
      },
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      serialize(item) {
        const url = new URL(item.url);
        const path = url.pathname.replace(/^\/(zh-Hant|zh|en|ko|th|hi|fr|de|es)\//, '/');
        const priorityByPath = {
          '/': 1.0,
          '/booking/': 0.95,
          '/guest-service/': 0.8,
          '/contact/': 0.6,
          '/privacy/': 0.3,
          '/terms/': 0.3,
          '/tokushoho/': 0.3,
          '/booking-success/': 0.2,
        };
        if (priorityByPath[path] !== undefined) {
          item.priority = priorityByPath[path];
        }
        if (path === '/booking/') item.changefreq = 'daily';
        return item;
      },
    }),
  ],
});
