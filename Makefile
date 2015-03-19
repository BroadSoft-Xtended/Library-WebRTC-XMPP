SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)

JADE_FILES := $(shell glob-cli "templates/**/*.jade")

all: js/templates.js node_modules/views node_modules/models

node_modules/views: lib/views
	ln -sf ../lib/views node_modules/views

node_modules/models: lib/models
	ln -sf ../lib/models node_modules/models

## Compile jade templates #########################################################
js/templates.js: $(JADE_FILES)
	templatizer -d templates -o node_modules/bdsft-webrtc-templates.js