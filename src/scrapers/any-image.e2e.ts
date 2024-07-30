/* eslint-disable @typescript-eslint/no-floating-promises */

import { it } from 'node:test';
import { defineScraperTestSuite, testScrapingUrl } from '../test-utils';

defineScraperTestSuite('any image', (getPage) => {
  it('can scrape a png image', async (t) => {
    await testScrapingUrl(
      t,
      getPage(),
      'https://upload.wikimedia.org/wikipedia/en/7/7d/Lenna_%28test_image%29.png',
    );
  });
});
