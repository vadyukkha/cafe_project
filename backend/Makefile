ifneq ("$(wildcard .env)","")
	include .docker.env
endif

args := $(wordlist 2, 100, $(MAKECMDGOALS))
ifndef args
MESSAGE = "No such command (or you pass two or many targets to ). List of possible commands: make help"
else
MESSAGE = "Done"
endif

db:
	docker-compose -f docker-compose.yml up -d --remove-orphans

lint:
	npm run lint

format:
	npx prisma format
	npx tsfmt -r
	
generate:
	npx prisma generate

migrate:
	npx prisma migrate dev --name $(args)

run:
	npm run dev

open_db:
	docker exec -it backend_postgres psql -d $(POSTGRES_DB) -U $(POSTGRES_USER)

%::
	echo $(MESSAGE)
