.PHONY: tests all unit functional run docker-image docker-push docker migrate db deploy deploy-with-helm port-forward wheels docker-base-image redeploy check docker-pull clean purge-sessions

GIT_ROOT		:= $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
VENV_ROOT		:= $(GIT_ROOT)/.venv
export VENV		?= $(VENV_ROOT)
export FLASK_DEBUG	:= 1
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
HELM_SET_VARS		:= --set image.tag=$(PROD_TAG) --set image.repository=$(DOCKER_AUTHOR)/$(PROD_IMAGE) --set oauth2.client_id=$(OAUTH2_CLIENT_ID) --set oauth2.client_secret=$(OAUTH2_CLIENT_SECRET) --set flask.secret_key=$(SECRET_KEY)-$(PROD_TAG)
NAMESPACE		:= notequalia-k8sns
HELM_RELEASE		:= $(NAMESPACE)-v0
FIGLET			:= $(shell which figlet)
WEB-APP_REACT_NGROK	:= notequalia-fe
BACKEND_FLASK_NGROK	:= notequalia-be

all: dependencies tests

$(VENV):  # creates $(VENV) folder if does not exist
	python3 -mvenv $(VENV)
	$(VENV)/bin/pip install -U pip setuptools

$(VENV)/bin/notequalia-io $(VENV)/bin/nosetests $(VENV)/bin/python $(VENV)/bin/pip: # installs latest pip
	test -e $(VENV)/bin/pip || $(MAKE) $(VENV)
	$(VENV)/bin/pip install -r development.txt
	$(VENV)/bin/pip install -e .

# Runs the unit and functional tests
tests: | $(VENV)/bin/nosetests  # runs all tests
	$(VENV)/bin/nosetests tests

# Install dependencies
dependencies: | $(VENV)/bin/nosetests
	$(VENV)/bin/pip install -r development.txt
	$(VENV)/bin/pip install -e .

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

# runs the server, exposing the routes to http://localhost:5000
run: purge-sessions | $(VENV)/bin/python
	$(VENV)/bin/notequalia-io web --port=5000


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
	kubepfm --target "$(NAMESPACE):.*web:5000:5000" --target "ingress-nginx:*nginx-ingress-controller*:80:80"
	# kubepfm --target "$(NAMESPACE):.*kibana.*:5601:5601" --target "$(NAMESPACE):.*web:5000:5000" --target "$(NAMESPACE):.*elastic.*:9200:9200" --target "$(NAMESPACE):.*elastic.*:9300:9300" --target "$(NAMESPACE):.*queue:4242:4242" --target "$(NAMESPACE):.*queue:6969:6969" --target "$(NAMESPACE):.*forwarder:5353:5353" --target "$(NAMESPACE):.*forwarder:5858:5858"

forward-queue-port:
	kubepfm --target "$(NAMESPACE):.*queue:4242:4242"

db: purge-sessions | $(VENV)/bin/notequalia-io
	@echo "recreating database from scratch..."
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
	helm dependency update --skip-refresh operations/helm/

template: operations/helm/charts
	helm template $(HELM_SET_VARS) operations/helm

deploy: tests k8s-namespace operations/helm/charts
	iterm2 color orange
	git push
	helm dependency update --skip-refresh operations/helm/
	iterm2 color red
	$(MAKE) helm-install || $(MAKE) helm-upgrade
	iterm2 color green

helm-install:
	helm install --namespace $(NAMESPACE) $(HELM_SET_VARS) -n $(HELM_RELEASE) operations/helm

helm-upgrade:
	helm upgrade --namespace $(NAMESPACE) $(HELM_SET_VARS) $(HELM_RELEASE) operations/helm

k8s-namespace:
	iterm2 color blue
	kubectl get namespaces | grep $(NAMESPACE) | awk '{print $$1}' || kubectl create namespace $(NAMESPACE)
	iterm2 color yellow

rollback:
	iterm2 color cyan
	-helm delete --purge $(HELM_RELEASE)
	-kubectl get pv -n $(NAMESPACE) -o yaml  | kubectl delete --timeout=50s -f -
	#iterm2 color purple
	iterm2 color green

undeploy: rollback
	#kubectl delete ns $(NAMESPACE)

k9s:
	iterm2 color k
	k9s -n $(NAMESPACE)

redeploy:
	$(MAKE) undeploy deploy

enqueue:
	$(VENV)/bin/notequalia-io enqueue -x $(X) -n 10 --address='tcp://127.0.0.1:4242' "$${USER}@$$(hostname):[SENT=$$(date +'%s')]"

close:
	$(VENV)/bin/notequalia-io close --address='tcp://127.0.0.1:4242'

worker:
	$(VENV)/bin/notequalia-io worker --address='tcp://127.0.0.1:6969'

setup-helm:
	helm repo add elastic https://helm.elastic.co


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
