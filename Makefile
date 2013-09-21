DIR := .
PUB_DIR := $(DIR)/public

.PHONY: build run clean

run: build
	cd $(PUB_DIR)/ && python -m SimpleHTTPServer

build: \
	$(PUB_DIR)/index.html \
	$(PUB_DIR)/app.js \
	$(PUB_DIR)/data.json

$(PUB_DIR)/:
	mkdir -p $(PUB_DIR)

$(PUB_DIR)/index.html: $(PUB_DIR) $(DIR)/index.jade
	jade < $(DIR)/index.jade > $(PUB_DIR)/index.html

$(PUB_DIR)/app.js: $(PUB_DIR) $(DIR)/app.coffee
	coffee -cp $(DIR)/app.coffee > $(PUB_DIR)/app.js

$(PUB_DIR)/data.json: $(PUB_DIR) $(DIR)/gendata.py
	python $(DIR)/gendata.py > $(PUB_DIR)/data.json

clean:
	rm -r $(PUB_DIR)