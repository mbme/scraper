# scraper
scrape the data from the page you're on

# Usage
* [Userscript](https://raw.githubusercontent.com/mbme/scraper/main/dist/scraper.user.js)

* [Bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet): add the following code to the url section of a new bookmark, or paste it in the url bar:
```
javascript:document.body.append(Object.assign(document.createElement('script'),{src:'https://raw.githubusercontent.com/mbme/scraper/main/dist/scraper.user.js',type: 'text/javascript'}))
```

# Build dependencies
* `node.js`
* `npm`
* `chromium` - to run e2e tests
* [`just`](https://github.com/casey/just)
