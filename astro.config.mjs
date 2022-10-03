import { execFileSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import { env } from 'process';
import sitemap from '@astrojs/sitemap';
import astroI18next from 'astro-i18next';

function enhanceEnvVariables() {
  if (!env.PUBLIC_BUILD_DATE) {
    env.PUBLIC_BUILD_DATE = new Date().toISOString();
  }

  if (!env.PUBLIC_COMMIT_ID) {
    env.PUBLIC_COMMIT_ID = execFileSync(
      'git',
      ['rev-parse', '--short', 'HEAD'],
      {
        encoding: 'utf8',
      }
    ).trim();
  }

  if (!env.PUBLIC_SITE_URL) {
    env.PUBLIC_SITE_URL = 'https://romajs.org';
  }
}

/**
 * @type {(publicUrl: string) => { base: string, site: string | undefined }}
 */
function computeBaseAndSite(publicUrl) {
  const siteFullURLWithPath = new URL(env.PUBLIC_SITE_URL);
  const base = siteFullURLWithPath.pathname || undefined;
  siteFullURLWithPath.pathname =
    siteFullURLWithPath.hash =
    siteFullURLWithPath.search =
      '';

  const site = siteFullURLWithPath.href;

  return {
    site,
    base,
  };
}

enhanceEnvVariables();
const { base, site } = computeBaseAndSite(env.PUBLIC_SITE_URL);

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    astroI18next(),
    sitemap({
      i18n: {
        defaultLocale: 'it', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
        locales: {
          en: 'en-US', // The `defaultLocale` value must present in `locales` keys
          it: 'it-IT',
        },
      },
    }),
  ],
  base,
  site,
});
