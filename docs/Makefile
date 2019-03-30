nodebin := ../node_modules/.bin

build: dist

dist:
	# TODO: typecheck, lint
	rm -rf dist
	$(nodebin)/parcel build src/index.html	

run:
	$(nodebin)/parcel src/index.html

.PHONY: run build dist
