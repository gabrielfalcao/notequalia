data "digitalocean_kubernetes_versions" "cognodes" {
  version_prefix = "1.19."
}

resource "digitalocean_kubernetes_cluster" "cognodes" {
  name    = "pool-cognodes"
  region  = "fra1"
  version = data.digitalocean_kubernetes_versions.cognodes.latest_version
  tags    = ["cognodes", "pythonclinic", "visualcues"]

  node_pool {
    name       = "pool-cognodes"
    size       = "s-1vcpu-2gb"
    auto_scale = true
    min_nodes  = 2
    max_nodes  = 3
  }
}
