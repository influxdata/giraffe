nodebin := ../node_modules/.bin
approot := /vis

build: dist

dist:
	# TODO: typecheck, lint
	rm -rf dist
	APP_ROOT=$(approot) $(nodebin)/parcel build --public-url=$(approot) src/index.html

run:
	APP_ROOT=$(approot) $(nodebin)/parcel serve --public-url=$(approot) src/index.html

.PHONY: run build dist
