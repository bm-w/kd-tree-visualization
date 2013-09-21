DIR := .
PUB_DIR := $(DIR)/public
MOD_DIR := $(DIR)/node_modules

COFFEE_BIN := $(MOD_DIR)/coffee-script/bin/coffee
JADE_BIN := $(MOD_DIR)/jade/bin/jade

.PHONY: run npm-install build clean

# ---

run: build
	cd $(PUB_DIR)/ && python -m SimpleHTTPServer

# ---

npm-install:\
	$(PUB_DIR)/index.html \
	$(PUB_DIR)/app.js \
	$(PUB_DIR)/data.json

build:
	npm install

$(PUB_DIR)/:
	mkdir -p $(PUB_DIR)

$(PUB_DIR)/index.html: $(PUB_DIR) $(DIR)/index.jade
	$(JADE_BIN) < $(DIR)/index.jade > $(PUB_DIR)/index.html

$(PUB_DIR)/app.js: $(PUB_DIR) $(DIR)/app.coffee
	$(COFFEE_BIN) -cp $(DIR)/app.coffee > $(PUB_DIR)/app.js

$(PUB_DIR)/data.json: $(PUB_DIR) $(DIR)/gendata.py
	python $(DIR)/gendata.py > $(PUB_DIR)/data.json

# ---

clean:
	rm -r $(PUB_DIR) $(MOD_DIR)