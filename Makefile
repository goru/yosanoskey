ARG = 
LIB = node_modules/.package-lock.json package-lock.json
SRC = forge.config.js index.html main.js preload.js

all: out

out: $(LIB) $(SRC)
	npm run make $(ARG)

$(LIB): package.json
	npm install

start: $(LIB)
	npm start

clean:
	rm -rf node_modules out

linux: $(LIB)
	npm run make -- --platform=linux

docker-linux:
	docker run -it --rm -e USERID=`id -u` -e GROUPID=`id -g` --mount type=bind,source="$(CURDIR)",target=/src ubuntu:22.04 /bin/bash -c -ex "\
		apt update;\
		apt install -y curl git make zip;\
		curl -fsSL https://deb.nodesource.com/setup_18.x | bash -;\
		apt install -y nodejs;\
		groupadd -g \$${GROUPID} user;\
		useradd -u \$${USERID} -g \$${GROUPID} -m user;\
		su - user -c 'cd /src; make linux'"

darwin: $(LIB)
	npm run make -- --platform=darwin --arch=universal

win32: $(LIB)
	npm run make -- --platform=win32 --arch=ia32
	npm run make -- --platform=win32 --arch=x64

docker-win32:
	docker run -it --rm -e USERID=`id -u` -e GROUPID=`id -g` --mount type=bind,source="$(CURDIR)",target=/src ubuntu:22.04 /bin/bash -c -ex "\
		apt update;\
		apt install -y curl git make wine zip;\
		curl -fsSL https://deb.nodesource.com/setup_18.x | bash -;\
		apt install -y nodejs;\
		groupadd -g \$${GROUPID} user;\
		useradd -u \$${USERID} -g \$${GROUPID} -m user;\
		su - user -c 'cd /src; make win32'"
