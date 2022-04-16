terraform {
  required_providers {
    random = {
      source = "hashicorp/random"
      version = "3.1.0"
    }
  }
}

provider "random" {
}

variable "mraz_name_length" {}

resource "random_pet" "mraz" {
  length = var.mraz_name_length
}
