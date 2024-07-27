# vim: set ft=make :

alias c := check
alias b := build

scrape *PARAMS:
  cargo run --bin mb-scraper {{PARAMS}}

check-types:
  npm run compiler-errors

lint:
  npm run lint

test:
  npm run test

check: check-types lint test

build:
  npm run build
