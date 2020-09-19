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
HELM_SET_VARS		:= --set image.tag=$(PROD_TAG) --set image.repository=$(DOCKER_AUTHOR)/$(PROD_IMAGE) --set oauth2.client_id=$(OAUTH2_CLIENT_ID) --set oauth2.client_secret=$(OAUTH2_CLIENT_SECRET) --set flask.secret_key=$(SECRET_KEY)-$(PROD_TAG) --set notequalia.merriam_webster_api.keys.thesaurus=$(MERRIAM_WEBSTER_THESAURUS_API_KEY) --set notequalia.merriam_webster_api.keys.dictionary=$(MERRIAM_WEBSTER_DICTIONARY_API_KEY)
NAMESPACE		:= notequalia-k8sns
HELM_RELEASE		:= $(NAMESPACE)-v0
FIGLET			:= $(shell which figlet)
WEB-APP_REACT_NGROK	:= notequalia-fe
BACKEND_FLASK_NGROK	:= notequalia-be

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
	$(VENV)/bin/notequalia-io create-user --email="foo@bar.com" --password="01234567"
	$(VENV)/bin/notequalia-io create-user --email="gfalcao@newstore.com" --password='Y;gCb$S*9N9_r~?%'

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
	helm dependency update --skip-refresh operations/helm/

template: operations/helm/charts
	helm template $(HELM_SET_VARS) operations/helm

deploy: tests db k8s-namespace operations/helm/charts
	iterm2 color orange
	git push
	helm dependency update --skip-refresh operations/helm/
	iterm2 color red
	$(MAKE) helm-install || $(MAKE) helm-upgrade
	iterm2 color green

deploy-cluster: setup-cluster
	$(MAKE) helm-install || $(MAKE) helm-upgrade

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
	iterm2 color green

k9s:
	iterm2 color k
	k9s -n $(NAMESPACE)
undeploy:
	helm delete --purge nginx-ingress
	helm delete --purge external-dns
	helm delete --purge cert-manager

redeploy:
	$(MAKE) undeploy deploy

setup-helm-and-tiller:
	kubectl -n kube-system create serviceaccount tiller
	kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
	helm init --history-max=20 --service-account tiller --wait --upgrade
	helm repo add dgraph https://charts.dgraph.io
	helm repo add elastic https://helm.elastic.co
	helm repo add jetstack https://charts.jetstack.io
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	helm repo add bitnami https://charts.bitnami.com/bitnami
	helm install --name nginx-ingress ingress-nginx/ingress-nginx --set controller.publishService.enabled=true
	helm install bitnami/external-dns --name external-dns -f operations/helm/externaldns-values.yaml

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
