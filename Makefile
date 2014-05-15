# © 2014 QUILLU INC.
# Konstruct Makefile

# Bins
JSONLINT = ./node_modules/.bin/jsonlint
JSHINT = ./node_modules/.bin/jshint
MOCHA = ./node_modules/.bin/mocha

# Files
JS_FILES = $(shell find lib -type f -name '*.js') $(shell find test -type f -name '*.js')
JSON_FILES = package.json

# Default to patch release. Can call deploy with VERSION={major|minor}.
VERSION = patch

# Default to development. Call with NODE_ENV=production
NODE_ENV = development

all: lint test

# Install
install:
	npm install

# Update
update:
	npm update

# Clean
clean:
	npm prune

# Test Watch
test:
	@NODE_ENV='$(NODE_ENV)' MOCHA test

# Test Watch
watch:
	@NODE_ENV='$(NODE_ENV)' MOCHA -w test

# Linting
lint: jsonlint jshint

jsonlint: $(JSON_FILES)
	@for i in $(JSON_FILES); do JSONLINT -q $$i || exit $$?; done

jshint: $(JS_FILES)
	@JSHINT -c .jshintrc $(JS_FILES)

# Deploy
deploy: lint test
	git stash
	npm version $(VERSION)
	git push origin master
	git push --tags
	git stash pop

.PHONY: all install update clean test watch lint jsonlint jshint deploy
