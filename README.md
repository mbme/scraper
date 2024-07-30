# scraper
scrape the data from the page you're on

# Usage
* Install Tampermonkey browser extension, then open & install the [Userscript](https://raw.githubusercontent.com/mbme/scraper/main/docs/scraper.user.js)

* [Bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet): add the following code to the url section of a new bookmark, or paste it in the url bar:
```
javascript:document.body.append(Object.assign(document.createElement('script'),{src:'https://mbme.github.io/scraper/scraper.user.js'}))
```
*NOTE*: the script is served using Github Pages to ensure the server returns a correct MIME type.

# Build dependencies
* `node.js`
* `npm`
* `chromium` - to run e2e tests
* [`just`](https://github.com/casey/just)
