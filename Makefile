start:
	BUILD_TARGET=development docker-compose up --build

local-staging:
	BUILD_TARGET=local_staging docker-compose up --build