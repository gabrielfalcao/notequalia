terraform {
  required_providers {
    digitalocean = {
      source = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}


variable "do_token" {}
variable "do_spaces_access_id" {}
variable "do_spaces_secret_key" {}

# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = var.do_token
  spaces_access_id = var.do_spaces_access_id
  spaces_secret_key = var.do_spaces_secret_key
}
