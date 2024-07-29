/* eslint-disable @typescript-eslint/no-floating-promises */

import { it } from 'node:test';
import { defineScraperTestSuite, testScrapingUrl } from '../test-utils';

defineScraperTestSuite('myanimelist', (getPage) => {
  it('can scrape a movie', async (t) => {
    await testScrapingUrl(t, getPage(), 'https://myanimelist.net/anime/523/Tonari_no_Totoro');
  });

  it('can scrape series', async (t) => {
    await testScrapingUrl(t, getPage(), 'https://myanimelist.net/anime/16498/Shingeki_no_Kyojin');
  });
});
