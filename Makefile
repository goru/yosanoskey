ARGS = 

all: out

linux:
	npm run make -- --platform=linux

darwin:
	npm run make -- --platform=darwin --arch=universal

win32:
	npm run make -- --platform=win32

out: forge.config.js index.html main.js node_modules/.package-lock.json package-lock.json preload.js
	npm run make $(ARGS)

node_modules/.package-lock.json package-lock.json: package.json
	npm install

start: package-lock.json
	npm start

clean:
	rm -rf node_modules out
