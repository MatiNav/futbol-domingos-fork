variable "project_id" {
  type = string
  description = "The ID of the GCP project"
  default = "futbol-app-451918"
}

variable "region" {
  type = string
  description = "The region of the GCP project"
  default = "us-central1"
}

variable "service_account" {
  type = string
  description = "The service account to use for the GCP project"
}

variable "cloud_service_name" {
  type = string
  description = "The name of the Cloud Run service"
  default = "futbol-domingos-2"
}