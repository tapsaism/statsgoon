.PHONY: run

build-front:
	echo Building statsgoon-front
	sh /Users/olliiivonen/Dabblings/statsgoon/statsgoon-front/build-to-local.sh

run:
	docker-compose -f docker-compose.yml up -d
	@echo statsgoon api and front running

ssh_web:
	docker exec -i -t $(shell docker ps -q --filter ancestor=nginx-minimal:latest) /bin/bash

stop:
	@echo 'Stopping Statshoon containers'
	docker kill $(shell docker ps -q --filter ancestor=nginx-minimal:latest) $(shell docker ps -q --filter ancestor=statsgoon/docker-api:latest)
	docker ps

clean: stop
	docker-compose rm -f

restart: stop run

cleanrun: clean run

web_logs:
	docker logs $(shell docker ps -q --filter ancestor=nginx-minimal:latest)

api_logs:
	docker logs $(shell docker ps -q --filter ancestor=statsgoon/docker-api:latest)
