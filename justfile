# vim: set ft=make :

alias c := check
alias b := build

scrape *PARAMS:
  cargo run --bin mb-scraper {{PARAMS}}

check-formatting:
  npm run check-fmt

check-types:
  npm run check-types

lint:
  npm run lint

test:
  npm run test

check: check-formatting check-types lint test

build:
  npm run build
