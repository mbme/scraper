/* eslint-disable @typescript-eslint/no-floating-promises */

import { it } from 'node:test';
import { defineScraperTestSuite, testScrapingUrl } from '../test-utils';

defineScraperTestSuite('steam', (getPage) => {
  it('can scrape a game', async (t) => {
    await testScrapingUrl(
      t,
      getPage(),
      'https://store.steampowered.com/app/990080/Hogwarts_Legacy/',
    );
  });
});
