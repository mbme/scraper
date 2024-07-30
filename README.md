# scraper
scrape the data from the page you're on

# Build dependencies
* `node.js`
* `npm`
* `chromium` - to run e2e tests
* [`just`](https://github.com/casey/just)

# Usage
* [Userscript](https://raw.githubusercontent.com/mbme/scraper/main/dist/scraper.user.js)

* [Bookmarklet](javascript:document.body.append(Object.assign(document.createElement('script'), {src: 'https://raw.githubusercontent.com/mbme/scraper/main/dist/scraper.user.js', type: 'text/javascript'}));
)
