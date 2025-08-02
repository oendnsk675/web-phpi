include .env
export $(shell sed 's/=.*//' .env)

run:
	@pnpm dev

styles:
	@pnpm styles:watch

run-postgres:
	docker run --name $(POSTGRES_CONTAINER_NAME) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DATABASE) \
		-d -p $(POSTGRES_PORT):5432 postgres:16.3

stop-postgres:
	docker stop $(POSTGRES_CONTAINER_NAME)
	docker rm $(POSTGRES_CONTAINER_NAME)

spin-up:
	docker stop $(POSTGRES_CONTAINER_NAME) || true
	docker rm $(POSTGRES_CONTAINER_NAME) || true
	docker volume rm $(shell docker inspect $(POSTGRES_CONTAINER_NAME) --format='{{range .Mounts}}{{.Name}}{{end}}') || true
	docker run --name $(POSTGRES_CONTAINER_NAME) \
		-e POSTGRES_USER=$(POSTGRES_USER) \
		-e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) \
		-e POSTGRES_DB=$(POSTGRES_DATABASE) \
		-d -p $(POSTGRES_PORT):5432 postgres:16.3
	@pnpm dev