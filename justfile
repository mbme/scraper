# vim: set ft=make :

alias c := check
alias b := build

e2e_test_args := "--experimental-test-snapshots --import tsx --test 'src/**/*.e2e.ts' --test-reporter spec"

scrape *PARAMS:
  cargo run --bin mb-scraper {{PARAMS}}

check-formatting:
  npm run check-fmt

check-types:
  npm run check-types

lint:
  npm run lint

check: check-formatting check-types lint

build:
  npm run build

e2e: build
  CHROMIUM_PATH=$(which chromium) node {{e2e_test_args}}

e2eh:
  DEBUG=true just e2e

e2e-update-snapshots:
  CHROMIUM_PATH=$(which chromium) node --test-update-snapshots {{e2e_test_args}}
