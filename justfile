# vim: set ft=make :

alias c := check
alias b := build

[confirm]
release:
  npm version major

check-formatting:
  npm run check-fmt

check-types:
  npm run check-types

lint:
  npm run lint

check: check-formatting check-types lint

build:
  npm run build

e2e *PARAMS: build
  CHROMIUM_PATH=$(which chromium) npx tsx {{PARAMS}} \
      --no-warnings=ExperimentalWarning \
      --experimental-test-snapshots \
      --test-reporter spec \
      --test-concurrency=1 \
      --test-timeout=40000 \
      --test 'src/**/*.e2e.ts'

e2e-update-snapshots:
  just e2e --test-update-snapshots

e2e-only:
  just e2e --test-only

e2e-name PATTERN:
  just e2e --test-name-pattern={{PATTERN}}

e2e-name-update-snapshot PATTERN:
  just e2e --test-name-pattern={{PATTERN}} --test-update-snapshots
