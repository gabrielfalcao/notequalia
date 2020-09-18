import kopf


# @kopf.on.login(retries=3)
# def login_fn(**kwargs):
#     return kopf.login_via_pykube(**kwargs)


@kopf.on.create("cognod.es", "v1", "applicationauthuser")
def create_fn(body, **kwargs):
    print(f"[handler=create] A handler is called with body: {body}")


@kopf.on.update("cognod.es", "v1", "applicationauthuser")
def update_fn(body, **kwargs):
    print(f"[handler=update] A handler is called with body: {body}")


@kopf.on.delete("cognod.es", "v1", "applicationauthuser")
def delete_fn(body, **kwargs):
    print(f"[handler=delete] A handler is called with body: {body}")
