.PHONY: tests all unit functional run docker-image docker-push docker migrate db deploy deploy-with-helm port-forward wheels docker-base-image redeploy check docker-pull clean purge-sessions

GIT_ROOT		:= $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
VENV_ROOT		:= $(GIT_ROOT)/.venv
export VENV		?= $(VENV_ROOT)
# export FLASK_DEBUG	:= 1
export HTTPS_API	?= $(shell ps aux | grep ngrok | grep -v grep)

export OAUTH2_ACCESS_TOKEN_URL	:= https://id.t.newstore.net/auth/realms/gabriel-NA-43928/protocol/openid-connect/token
export OAUTH2_AUTHORIZE_URL	:= https://id.t.newstore.net/auth/realms/gabriel-NA-43928/protocol/openid-connect/auth
export OAUTH2_BASE_URL		:= https://id.t.newstore.net/auth/realms/gabriel-NA-43928/protocol/openid-connect/
export OAUTH2_CALLBACK_URL	:= https://api.visualcu.es/callback/oauth2
export OAUTH2_CLIENT_ID		:= fake-newstore-api-v1
export OAUTH2_CLIENT_SCOPE	:= openid profile email
export OAUTH2_CLIENT_SECRET	:= da341d0c-eaa4-460b-af6b-dac5de6443b5
export OAUTH2_DOMAIN		:= id.t.newstore.net
export OAUTH2_CLIENT_AUDIENCE	:= https://api.visualcu.es/
export SECRET_KEY		:= $(shell 2>/dev/null dd bs=128 count=1 if=/dev/urandom | base64 | head -1)
export MERRIAM_WEBSTER_DICTIONARY_API_KEY	:= 234297ff-eb8d-49e5-94d6-66aec4c4b7e0
export MERRIAM_WEBSTER_THESAURUS_API_KEY	:= eb37bf1c-0f2a-4399-86b8-ba444a0a9fbb

export DIGITAL_OCEAN_SPACES_ACCESS_KEY	:= GWN5P6GR4PXNUOZMWIUY
export DIGITAL_OCEAN_SPACES_SECRET_KEY	:= MG3dT7Ux8IA5jCL1x4oerfPH8Us4Z3Lqb8Du8CRqRKk

DEPLOY_TIMEOUT		:= 300
# NOTE: the sha must be the long version to match the ${{ github.sha
# }} variable in the github actions. Using %h (short sha) will cause
# deploys to fails with ImagePullBackOff
BASE_TAG		:= latest
PROD_TAG		?= $(shell git log --pretty="format:%H" -n1 . | tail -1)
#PROD_TAG		?= e5602ba7df33e573bc278ea71bfd5322f9ebbcdd  # stable
DOCKER_AUTHOR		:= gabrielfalcao
BASE_IMAGE		:= notequalia-io-base
PROD_IMAGE		:= k8s-notequalia-io
DOCKER_ENV		:= $(GIT_ROOT)/tools/docker.env
KUBE_ENV_CATTLE		:= $(GIT_ROOT)/kube/cattle/kube.env
KUBE_ENV_PET		:= $(GIT_ROOT)/kube/pets/kube.env
KUBE_ENV		:= $(KUBE_ENV_CATTLE) $(KUBE_ENV_PET)

KUBE_BUTLER_YML_CATTLE	:= $(GIT_ROOT)/kube/cattle/drone-ci-butler.yml
KUBE_BUTLER_YML_PET	:= $(GIT_ROOT)/kube/pets/drone-ci-butler.yml
KUBE_BUTLER_YML		:= $(KUBE_BUTLER_YML_CATTLE) $(KUBE_BUTLER_YML_PET)
BUILD_PATHS		:= build docs/build frontend/build
DOCKER_IMAGE_NAME	:= gabrielfalcao/drone-ci-butler/runtime
BRANCH_NAME		:= $(shell git branch | grep '^[*]' | awk '{print $$2}')
DOCKER_IMAGE_TAG	:= $(shell git rev-parse origin/$(BRANCH_NAME))
TMP_KUBE		:= $(GIT_ROOT)/wip/cattle.yml
K8S_NAMESPACE		:= ci-butler-ns
KUSTOMIZATION_PATH	:= $(GIT_ROOT)/kube
KUSTOMIZATION_CATTLE_YML:= $(KUSTOMIZATION_PATH)/cattle/kustomization.yml
KUSTOMIZATION_PET_YML	:= $(KUSTOMIZATION_PATH)/pets/kustomization.yml
KUSTOMIZATION_YML	:= $(KUSTOMIZATION_CATTLE_YML) $(KUSTOMIZATION_PET_YML)
TEST_CONFIG_YML		:= $(GIT_ROOT)/tests/drone-ci-butler.yml
K8S_MAX_LOG_REQUESTS	:= 100


FIGLET			:= $(shell which figlet)
WEB-APP_REACT_NGROK	:= notequalia-fe
BACKEND_FLASK_NGROK	:= notequalia-be
export DOCKER_IMAGE_TAG



all: dependencies tests

venv $(VENV):  # creates $(VENV) folder if does not exist
	python3 -mvenv $(VENV)
	$(VENV)/bin/pip install -U pip setuptools

develop $(VENV)/bin/notequalia-io $(VENV)/bin/nosetests $(VENV)/bin/python $(VENV)/bin/pip: # installs latest pip
	test -e $(VENV)/bin/pip || $(MAKE) $(VENV)
	$(VENV)/bin/pip install -r development.txt
	$(VENV)/bin/python setup.py develop

# Runs the unit and functional tests
tests: unit functional  # runs all tests


# Install dependencies
dependencies: | $(VENV)/bin/nosetests
	$(VENV)/bin/pip install -r development.txt
	$(VENV)/bin/python setup.py develop

check:
	$(VENV)/bin/notequalia-io check

migrate:
	$(VENV)/bin/notequalia-io migrate-db

# runs unit tests

unit: | $(VENV)/bin/nosetests  # runs only unit tests
	$(VENV)/bin/nosetests --cover-erase tests/unit

functional:| $(VENV)/bin/nosetests  # runs functional tests
	$(VENV)/bin/nosetests tests/functional

tdd-functional:| $(VENV)/bin/nosetests  # runs functional tests
	$(VENV)/bin/nosetests --with-watch tests/functional

tdd-unit:| $(VENV)/bin/nosetests  # runs unit tests
	$(VENV)/bin/nosetests --with-watch tests/unit

# runs the server, exposing the routes to http://localhost:5000
run: purge-sessions | $(VENV)/bin/python
	$(VENV)/bin/notequalia-io web --port=5000

# runs the server, exposing the routes to http://localhost:5000
operator: purge-sessions | $(VENV)/bin/python
	$(VENV)/bin/notequalia-io k8s

enqueue:
	$(VENV)/bin/notequalia-io enqueue -x $(X) -n 10 --address='tcp://127.0.0.1:4242' "$${USER}@$$(hostname):[SENT=$$(date +'%s')]"

close:
	$(VENV)/bin/notequalia-io close --address='tcp://127.0.0.1:4242'

worker:
	$(VENV)/bin/notequalia-io worker --address='tcp://127.0.0.1:6969'


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

create-user:
	$(VENV)/bin/notequalia-io create-user --email="foo@bar.com" --password="012345678"
	$(VENV)/bin/notequalia-io create-user --email="gabriel@nacaolivre.org" --password='012345678'
	$(VENV)/bin/notequalia-io create-user --email="gfalcao@newstore.com" --password='012345678'

docker: docker-image docker-push

docker-pull:
	docker pull $(DOCKER_AUTHOR)/$(BASE_IMAGE):$(BASE_TAG)
	docker pull $(DOCKER_AUTHOR)/$(PROD_IMAGE):$(PROD_TAG)
	docker pull $(DOCKER_AUTHOR)/$(PROD_IMAGE)

port-forward:
	kubepfm --target "$(NAMESPACE):.*web:5000:5000" --target "ingress-nginx:*nginx-ingress-controller*:80:80"
	# kubepfm --target "$(NAMESPACE):.*kibana.*:5601:5601" --target "$(NAMESPACE):.*web:5000:5000" --target "$(NAMESPACE):.*elastic.*:9200:9200" --target "$(NAMESPACE):.*elastic.*:9300:9300" --target "$(NAMESPACE):.*queue:4242:4242" --target "$(NAMESPACE):.*queue:6969:6969" --target "$(NAMESPACE):.*forwarder:5353:5353" --target "$(NAMESPACE):.*forwarder:5858:5858"

forward-queue-port:
	kubepfm --target "$(NAMESPACE):.*queue:4242:4242"

db: purge-sessions | $(VENV)/bin/notequalia-io
	@echo "recreating database from scratch..."
	-@2>/dev/null echo "DROP TABLE alembic_version;" psql -U notequalia_io notequalia_io || echo ''
	-@2>/dev/null dropdb notequalia_io || echo ''
	-@2>/dev/null dropuser notequalia_io || echo 'no db user'
	-@2>/dev/null createuser notequalia_io --createrole --createdb
	-@2>/dev/null createdb notequalia_io
	-@psql postgres << "CREATE ROLE notequalia_io WITH LOGIN PASSWORD 'Wh15K3y'"
	-@psql postgres << "GRANT ALL PRIVILEGES ON DATABASE notequalia_io TO notequalia_io;"
	$(VENV)/bin/notequalia-io migrate-db

purge-sessions:
	$(VENV)/bin/notequalia-io purge-sessions


operations/helm/charts:
	$(HELM2) dependency update --skip-refresh operations/helm/

template: operations/helm/charts
	$(HELM2) template $(HELM_SET_VARS) operations/helm

setup-cert-manager: # setup-helm-and-tiller
	kubectl apply -f operations/kube/cert-manager.crds.yaml
	-kubectl create namespace cert-manager
	helm install -n cert-manager --version v0.14.1 --namespace cert-manager jetstack/cert-manager
	kubectl apply -f operations/kube/letsencrypt-staging-issuer.yaml
	kubectl apply -f operations/kube/letsencrypt-prod-issuer.yaml

setup-cluster: # setup-cert-manager
	kubectl apply -f operations/kube/namespaces.yaml
	kubectl apply -f operations/kube/digitalocean-flexplugin-rbac.yml
	kubectl apply -f operations/kube/storage-class-digitalocean.yml
	-kubectl create clusterrolebinding add-on-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default
	-kubectl create -f notequalia/k8s/crd.yaml

tunnel:
	ngrok http --subdomain=$(BACKEND_FLASK_NGROK) 5000

tunnel-react:
	ngrok http --subdomain=$(WEB-APP_REACT_NGROK) 3000

clean:
	rm -rf .venv

web-app/build/index.html:
	cd web-app && npm run build

react-app: web-app/build/index.html
	cp -f web-app/build/index.html notequalia/web/templates/index.html
	rm -rf notequalia/web/static/{js,css}
	rsync -putaoz web-app/build/static/ notequalia/web/static/
	rsync -putaoz web-app/build/ notequalia/web/static/
	rm -rf notequalia/web/static/static
	rm -f web-app/build/index.html
	git add notequalia/web/static/
	-git commit notequalia/web/{templates,static}/ -m "new release of react-app"

# https://cert-manager.io/docs/tutorials/backup/
cert-manager-backup.yaml:
	kubectl get -o yaml --all-namespaces issuer,clusterissuer,certificates,certificaterequests > cert-manager-backup.yaml

black:
	black -l 79 notequalia tests

local-splash:
	docker run --rm -p 8050:8050 scrapinghub/splash


kube: clean $(TMP_KUBE) $(KUSTOMIZATION_YML)

docs:
	$(MAKE) -C docs html
deploy: $(TMP_KUBE)
	-$(ITERM2) name deploy && $(ITERM2) color grey 6
	@echo "\033[0;34mImage \033[1;35m$(DOCKER_IMAGE_NAME)\033[0m"
	@echo "\033[0;34mTag \033[1;36m$(DOCKER_IMAGE_TAG)\033[0m"
	@kubectl get ns $(K8S_NAMESPACE) || kubectl create ns $(K8S_NAMESPACE)
	@kubectl -n $(K8S_NAMESPACE) apply -f $(TMP_KUBE)

undeploy: undeploy-application undeploy-infra

undeploy-application:
	kubectl -n $(K8S_NAMESPACE) delete service -l app.kubernetes.io/name=drone-ci-butler
	kubectl -n $(K8S_NAMESPACE) delete statefulset -l app.kubernetes.io/name=drone-ci-butler
	kubectl -n $(K8S_NAMESPACE) delete deployment -l app.kubernetes.io/name=drone-ci-butler

undeploy-infra:
	kubectl -n $(K8S_NAMESPACE) delete service -l drone-ci-butler/role=infra
	kubectl -n $(K8S_NAMESPACE) delete statefulset -l drone-ci-butler/role=infra
	kubectl -n $(K8S_NAMESPACE) delete deployment -l drone-ci-butler/role=infra


undeploy-all:
	kubectl -n $(K8S_NAMESPACE) delete deployment,service,statefulset --all

undeploy-volume-claims:
	kubectl -n $(K8S_NAMESPACE) delete pvc -l app.kubernetes.io/name=drone-ci-butler
	kubectl -n $(K8S_NAMESPACE) delete pv -l app.kubernetes.io/name=drone-ci-butler

k8s-delete-all-resources:
	test -f $(TMP_KUBE) && kubectl -n $(K8S_NAMESPACE) delete -f $(TMP_KUBE)

k8s-delete-pvs:
	kubectl -n $(K8S_NAMESPACE) get pvc --field-selector metadata.namespace=$(K8S_NAMESPACE) -o yaml | kubectl -n $(K8S_NAMESPACE)  delete -f -

k8s-delete-ns:
	kubectl delete ns $(K8S_NAMESPACE)
	$(MAKE) k8s-resources
logs-web:
	kubectl -n ci-butler-ns logs --max-log-requests $(K8S_MAX_LOG_REQUESTS) --prefix --ignore-errors=true deployment/drone-ci-butler-web -f --all-containers

logs-workers:
	kubectl -n ci-butler-ns logs --max-log-requests $(K8S_MAX_LOG_REQUESTS) --prefix --ignore-errors=true deployment/drone-ci-butler-build-info-worker -f --all-containers

logs-queue:
	kubectl -n ci-butler-ns logs --max-log-requests $(K8S_MAX_LOG_REQUESTS) --prefix --ignore-errors=true deployment/drone-ci-butler-queue -f --all-containers

k8s-resources:
	kubectl api-resources --verbs=list --namespaced -o name | xargs -n 1 kubectl -n $(K8S_NAMESPACE) get --show-kind --ignore-not-found -n $(K8S_NAMESPACE)

k8s-purge-redis:
	 kubectl -n $(K8S_NAMESPACE) exec deployment/drone-ci-butler-queue -- bash -c "drone-ci-butler purge --redis-queue"

k8s-purge-all:
	 kubectl -n $(K8S_NAMESPACE) exec deployment/drone-ci-butler-queue -- bash -c "drone-ci-butler purge --elasticsearch --redis-queue --http-cache"

k8s-shell-queue:
	 kubectl -n $(K8S_NAMESPACE) exec -ti deployment/drone-ci-butler-queue -- bash

k8s-shell-kibana:
	 kubectl -n $(K8S_NAMESPACE) exec -ti service/drone-ci-butler-kibana -- bash

k8s-shell-redis:
	 kubectl -n $(K8S_NAMESPACE) exec -ti service/drone-ci-butler-redis -- bash

k8s-job:
	 kubectl -n $(K8S_NAMESPACE) exec deployment/drone-ci-butler-queue -- bash -c "drone-ci-butler builds --redis-only > /dev/null 2> /dev/null &"

redeploy:
	$(MAKE) undeploy
	$(MAKE) deploy

$(TMP_KUBE): $(KUBE_ENV) $(KUBE_BUTLER_YML) $(KUSTOMIZATION_YML)
	-$(ITERM2) name $(shell basename $@) && $(ITERM2) color blue 3
	@kustomize build kube/cattle > $@
	@echo "\033[1;37mCREATED \033[1;32m$(TMP_KUBE)\033[0m"
	@echo "\t⬆️️ \033[1;34mthis is the 'kubernetes' file\033[0m"

k9s:
	-@$(ITERM2) name k8s 🛳 && $(ITERM2) color k
	k9s -n $(K8S_NAMESPACE)

env-docker: | $(DOCKER_ENV)

# build base docker image
docker-base:
	docker build -t $(DOCKER_IMAGE_NAME)-base -f Dockerfile.base .

# build production docker image
docker-k8s:
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG) -f Dockerfile .
	docker tag $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG) $(DOCKER_IMAGE_NAME):latest

# pushes the latest image
docker-push:
	docker push $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG)
	docker push $(DOCKER_IMAGE_NAME):latest

docker-push-base:
	docker push $(DOCKER_IMAGE_NAME)-base:latest

##############################################################
# Real targets (only run target if its file has been "made" by
#               Makefile yet)
##############################################################

$(KUSTOMIZATION_YML):
	-$(ITERM2) name $(shell basename $@) && $(ITERM2) color grey 3
	cp -f $(KUSTOMIZATION_PATH)/kustomization.yaml $@
	@(cd $(shell dirname $@) > /dev/null && kustomize edit set namespace $(K8S_NAMESPACE))
	@(cd $(shell dirname $@) > /dev/null && kustomize edit set image $(DOCKER_IMAGE_NAME)=$(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG))
	@echo "\033[1;37mCOPIED \033[1;36m$@\033[0m"

$(NODE_MODULES):
	cd frontend && yarn

# creates virtual env if necessary and installs pip and setuptools
$(VENV): | $(REQUIREMENTS_PATH)  # creates $(VENV) folder if does not exist
	echo "Creating virtualenv in $(VENV_ROOT)" && python3 -mvenv $(VENV)

# installs pip and setuptools in their latest version, creates virtualenv if necessary
$(VENV)/bin/python $(VENV)/bin/pip: # installs latest pip
	@test -e $(VENV)/bin/python || $(MAKE) $(VENV)
	@test -e $(VENV)/bin/pip || $(MAKE) $(VENV)

 # installs latest version of the "black" code formatting tool
$(VENV)/bin/black: | $(VENV)/bin/pip
	$(VENV)/bin/pip install -U black

# installs this package in "edit" mode after ensuring its requirements are installed
$(VENV)/bin/gunicorn $(VENV)/bin/alembic $(VENV)/bin/pytest $(VENV)/bin/nosetests $(MAIN_CLI_PATH): | $(VENV) $(VENV)/bin/pip $(VENV)/bin/python $(REQUIREMENTS_PATH)
	$(VENV)/bin/pip install -r $(REQUIREMENTS_PATH)
	$(VENV)/bin/pip install -e .

# ensure that REQUIREMENTS_PATH exists
$(REQUIREMENTS_PATH):
	@echo "The requirements file $(REQUIREMENTS_PATH) does not exist"
	@echo ""
	@echo "To fix this issue:"
	@echo "  edit the variable REQUIREMENTS_NAME inside of the file:"
	@echo "  $(MAKEFILE_PATH)."
	@echo ""
	@exit 1

# generates environment variables with secrets
$(DOCKER_ENV) $(KUBE_ENV): clean
	-$(ITERM2) name $(shell basename $(shell dirname $@)) env && $(ITERM2) color yellow 3
	@$(MAIN_CLI_PATH) env > $@
	@echo "\033[1;37mCREATED \033[1;32m$@\033[0m"

$(KUBE_BUTLER_YML):
	-$(ITERM2) name $(shell basename $@) && $(ITERM2) color grey 6
	@cp -f ~/.drone-ci-butler.yml $@
	@echo "\033[1;37mUPDATED \033[1;32m$@\033[0m"
###############################################################
# Declare all target names that exist for convenience and don't
# represent real paths, which is what Make expects by default:
###############################################################

.PHONY: \
	all \
	black \
	builds \
	clean \
	compose \
	dependencies \
	deploy \
	develop \
	docs \
	docker-base \
	docker-k8s \
	env-docker \
	functional \
	k8s-resources \
	public \
	purge \
	react-app \
	redeploy \
	release \
	release-build \
	release-push \
	run \
	setup \
	tdd \
	tests \
	tunnel \
	unit \
	web \
	undeploy \
	undeploy-infra \
	undeploy-application \
	undeploy-all \
	deploy \
	kube \
	port-forward \
	k8s-job \
	k8s-delete-ns \
	k8s-delete-pvs \
	k8s-purge-redis \
	queue-logs \
	python-format \
	pod-logs \
	pod-logs-web

.DEFAULT_GOAL	:= help
