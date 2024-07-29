/* eslint-disable @typescript-eslint/no-floating-promises */

import { it } from 'node:test';
import { defineScraperTestSuite, scrapePage, setupPage } from './test-utils';

defineScraperTestSuite('any website', (getPage) => {
  it('works everywhere', async (t) => {
    const page = getPage();

    await setupPage(page, 'https://google.com/');

    await page.locator('#_scraper-ui-panel').wait();

    const result = await scrapePage(t, page);

    t.assert.snapshot(result);
  });
});
