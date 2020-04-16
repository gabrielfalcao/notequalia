.PHONY: tests all unit functional run docker-image docker-push docker migrate db deploy deploy-with-helm port-forward wheels docker-base-image redeploy check docker-pull purge

export FLASK_DEBUG	:= 1
export VENV		?= .venv
export HTTPS_API	?= $(shell ps aux | grep ngrok | grep -v grep)

DEPLOY_TIMEOUT		:= 300
# NOTE: the sha must be the long version to match the ${{ github.sha
# }} variable in the github actions. Using %h (short sha) will cause
# deploys to fails with ImagePullBackOff
BASE_TAG		:= $(shell git log --pretty="format:%H" -n1 Dockerfile.base *.txt setup.py)
PROD_TAG		:= $(shell git log --pretty="format:%H" -n1 .)
DOCKER_AUTHOR		:= gabrielfalcao
BASE_IMAGE		:= cahoots-in-base
PROD_IMAGE		:= k8s-cahoots-in
HELM_SET_VARS		:= --set image.tag=$(PROD_TAG) --set image.repository=$(DOCKER_AUTHOR)/$(PROD_IMAGE)
NAMESPACE		:= $$(newstore k8s space current)
FIGLET			:= (2>/dev/null which figlet && figlet) || echo


all: dependencies tests

$(VENV):  # creates $(VENV) folder if does not exist
	python3 -mvenv $(VENV)
	$(VENV)/bin/pip install -U pip setuptools

$(VENV)/bin/cahoots-in $(VENV)/bin/nosetests $(VENV)/bin/python $(VENV)/bin/pip: # installs latest pip
	test -e $(VENV)/bin/pip || make $(VENV)
	$(VENV)/bin/pip install -r development.txt
	$(VENV)/bin/pip install -e .

# Runs the unit and functional tests
tests: $(VENV)/bin/nosetests  # runs all tests
	$(VENV)/bin/nosetests tests

# Install dependencies
dependencies: | $(VENV)/bin/nosetests
	$(VENV)/bin/pip install -r development.txt

check:
	$(VENV)/bin/cahoots-in check

migrate:
	$(VENV)/bin/cahoots-in migrate-db

# runs unit tests

unit: $(VENV)/bin/nosetests  # runs only unit tests
	$(VENV)/bin/nosetests --cover-erase tests/unit

functional: $(VENV)/bin/nosetests  # runs functional tests
	$(VENV)/bin/nosetests tests/functional

# runs the server, exposing the routes to http://localhost:5000
run: $(VENV)/bin/python
	$(VENV)/bin/cahoots-in web --port=5000 --host=0.0.0.0


docker-base-image:
	@$(FIGLET) base image
	docker images | grep "$(BASE_IMAGE):$(BASE_TAG)" || docker build -f Dockerfile.base -t "$(DOCKER_AUTHOR)/$(BASE_IMAGE):$(BASE_TAG)" .

docker-image: docker-base-image
	$(FIGLET) production image
	docker tag "$(DOCKER_AUTHOR)/$(BASE_IMAGE):$(BASE_TAG)" "$(DOCKER_AUTHOR)/$(BASE_IMAGE)"
	docker build -f Dockerfile -t $(DOCKER_AUTHOR)/$(PROD_IMAGE):$(PROD_TAG) .
	docker tag $(DOCKER_AUTHOR)/$(PROD_IMAGE):$(PROD_TAG) $(DOCKER_AUTHOR)/$(PROD_IMAGE):latest

docker-push:
	@2>/dev/null docker login -p $$(echo  "a2ltazI1MDIK" | base64 -d) -u gabrielfalcao
	docker push $(DOCKER_AUTHOR)/$(PROD_IMAGE):$(PROD_TAG)

docker-push-all: docker-push
	docker push $(DOCKER_AUTHOR)/$(BASE_IMAGE):$(BASE_TAG)
	docker push $(DOCKER_AUTHOR)/$(BASE_IMAGE)
	docker push $(DOCKER_AUTHOR)/$(PROD_IMAGE)

wheels:
	mkdir -p wheels
	docker run --rm -w /python -v $$(pwd):/python -v $$(pwd)/wheels:/wheels python:3.7-alpine sh -c 'pip wheel -r development.txt'

docker: docker-image docker-push

docker-pull:
	docker pull $(DOCKER_AUTHOR)/$(BASE_IMAGE):$(BASE_TAG)
	docker pull $(DOCKER_AUTHOR)/$(PROD_IMAGE):$(PROD_TAG)
	docker pull $(DOCKER_AUTHOR)/$(PROD_IMAGE)

port-forward:
	newstore k8s run kubepfm --target "$(NAMESPACE):.*kibana.*:5601:5601" --target "$(NAMESPACE):.*web:5000:5000" --target "$(NAMESPACE):.*elastic.*:9200:9200" --target "$(NAMESPACE):.*elastic.*:9300:9300" --target "$(NAMESPACE):.*queue:4242:4242" --target "$(NAMESPACE):.*queue:6969:6969" --target "$(NAMESPACE):.*forwarder:5353:5353" --target "$(NAMESPACE):.*forwarder:5858:5858"

forward-queue-port:
	newstore k8s run kubepfm --target "$(NAMESPACE):.*queue:4242:4242"

db: $(VENV)/bin/cahoots-in
	-@2>/dev/null dropdb cahoots_in || echo ''
	-@2>/dev/null dropuser cahoots_in || echo 'no db user'
	-@2>/dev/null createuser cahoots_in --createrole --createdb
	-@2>/dev/null createdb cahoots_in
	-@psql postgres << "CREATE ROLE cahoots_in WITH LOGIN PASSWORD 'Wh15K3y'"
	-@psql postgres << "GRANT ALL PRIVILEGES ON DATABASE cahoots_in TO cahoots_in;"
	$(VENV)/bin/cahoots-in migrate-db

deploy:
	helm template $(HELM_SET_VARS) operations/helm > /dev/null
	-(2>/dev/null newstore k8s space current && newstore k8s stack delete all) || newstore k8s space create
	make helm-install

helm-install:
	git push
	helm dependency update --skip-refresh operations/helm/
	newstore k8s helm install $(HELM_SET_VARS) --timeout $(DEPLOY_TIMEOUT) --no-update --debug operations/helm


rollback:
	helm template $(HELM_SET_VARS) operations/helm > /dev/null
	-newstore k8s space delete all --confirm

redeploy: rollback deploy

enqueue:
	$(VENV)/bin/cahoots-in enqueue -x $(X) -n 10 --address='tcp://127.0.0.1:4242' "$${USER}@$$(hostname):[SENT=$$(date +'%s')]"

close:
	$(VENV)/bin/cahoots-in close --address='tcp://127.0.0.1:4242'

worker:
	$(VENV)/bin/cahoots-in worker --address='tcp://127.0.0.1:6969'

setup-helm:
	helm repo add elastic https://helm.elastic.co
	2>/dev/null newstore k8s space current || newstore k8s space create

tunnel:
	ngrok http --subdomain=pron-f1l3-serv3r 5000

purge:
	rm -rf .venv
