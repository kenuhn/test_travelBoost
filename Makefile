APP_NAME=qfront
GCP_TAG_NAME=gcr.io/sonorous-dragon-276210/$(APP_NAME)

GIT_BRANCH = $(shell git rev-parse --abbrev-ref HEAD)
GIT_HASH = $(shell git rev-parse --short HEAD)
GIT_DATE = $(shell git show -s --date=format:'%Y%m%d-%H%M' --format=%cd)


############
# Docker
#

docker-build:
	docker build -t $(GCP_TAG_NAME) .

docker-run:
	docker run -p 3000:3000 $(GCP_TAG_NAME)

docker-release:
	docker buildx build --platform linux/amd64 -t $(GCP_TAG_NAME):latest -t $(GCP_TAG_NAME):$(GIT_HASH) --push .

cloud-run-deploy: docker-release
	gcloud run deploy qfront --image $(GCP_TAG_NAME):latest --region europe-west1

staging-cloud-run-deploy: docker-release
	gcloud run deploy qfront-staging --image $(GCP_TAG_NAME):latest --region europe-west1