start:
	docker-compose up

stop:
	docker-compose down

restart:
	docker-compose down
	docker-compose up

build:
	docker-compose build

install:
	docker-compose run --rm client install

deploy_production_build:
	docker-compose -f docker-compose.production.yaml build

deploy_production:
	docker-compose -f docker-compose.production.yaml up

deploy_build_and_run:
	docker-compose -f docker-compose.production.yaml up --build

build_and_upload:
	docker-compose -f docker-compose.production.yaml build