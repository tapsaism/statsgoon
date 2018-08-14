.PHONY: run build

build:
	docker build --rm -t statsgoon/docker-api .

run: build
	docker run -p 3000:3000 -d statsgoon/docker-api
	@echo 'Statsgoon api running on http://localhost:3000'

kill:
	@echo 'Killing Statshoon containers'
	docker kill $(shell docker ps -q --filter ancestor=statsgoon/docker-api:latest)

tty:
	docker exec -i -t $(shell docker ps -q --filter ancestor=statsgoon/docker-api:latest) /bin/bash

root:
	docker exec -u 0 -ti $(shell docker ps -q --filter ancestor=statsgoon/docker-api:latest) /bin/bash

restart: kill run
