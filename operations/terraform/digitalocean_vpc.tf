resource "digitalocean_vpc" "default_nyc1" {
  name     = "default-nyc1"
  region   = "nyc1"
  ip_range = "10.116.0.0/20"
  # id       = "fc7eaea7-d57d-488a-af9a-a12704aa0b82"
}
resource "digitalocean_vpc" "default_ams3" {
  name     = "default-ams3"
  region   = "ams3"
  ip_range = "10.133.0.0/16"
  # id       = "b7a49eaa-dc83-11e8-a3da-3cfdfea9f0d8"
}
resource "digitalocean_vpc" "default_nyc3" {
  name     = "default-nyc3"
  region   = "nyc3"
  ip_range = "10.132.0.0/16"
  # id       = "9ae56af2-dc84-11e8-80bc-3cfdfea9fba1"
}
resource "digitalocean_vpc" "default_fra1" {
  name     = "default-fra1"
  region   = "fra1"
  ip_range = "10.135.0.0/16"
  #id       = "f6e022f3-dc84-11e8-8b13-3cfdfea9f160"
}
