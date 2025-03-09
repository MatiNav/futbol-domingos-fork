terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "6.0.1"
    }
  }
}

provider "google" {
    project = "futbol-app-451918"
    region = "us-central1"
}