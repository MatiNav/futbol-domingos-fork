resource "google_cloudbuild_trigger" "nextjs_cloud_run_trigger" {
  name        = "futbol-domingos-nextjs-cloud-build-trigger"
  description = "Build and deploy to Cloud Run service futbol-domingos on push to 'main'"

  github {
    owner = "MatiNav"  # GitHub Username or Organization
    name  = "futbol-domingos-fork" # Repository Name
    push {
      branch = "^main$"
    }
  }

  substitutions = {
    _SERVICE_NAME = "futbol-domingos"
    _PROJECT_ID = var.project_id
    _REGION = var.region
    _SERVICE_ACCOUNT = var.service_account
    _GCP_FUTBOL_APP_BUCKET_NAME = var.GCP_FUTBOL_APP_BUCKET_NAME  
    _MONGODB_URI = var.MONGODB_URI
    _REDIS_HOST = var.REDIS_HOST
    _REDIS_PORT = var.REDIS_PORT
    _REDIS_PASSWORD = var.REDIS_PASSWORD
    _REDIS_USERNAME = var.REDIS_USERNAME
    _PUSHER_APP_ID = var.PUSHER_APP_ID
    _PUSHER_KEY = var.PUSHER_KEY
    _PUSHER_SECRET = var.PUSHER_SECRET
    _PUSHER_CLUSTER = var.PUSHER_CLUSTER
    _NEXT_PUBLIC_PUSHER_KEY = var.NEXT_PUBLIC_PUSHER_KEY
    _NEXT_PUBLIC_PUSHER_CLUSTER = var.NEXT_PUBLIC_PUSHER_CLUSTER
    _GCP_PROJECT_ID = var.GCP_PROJECT_ID
    _GCP_CLIENT_EMAIL = var.GCP_CLIENT_EMAIL
    _GCP_PRIVATE_KEY = var.GCP_PRIVATE_KEY
  }

  filename = "infrastructure/cloud_build/cloudbuild.yaml"  # Cloud Build configuration file path in repo

  included_files = ["infrastructure/cloud_build/cloudbuild.yaml", "infrastructure/cloud_build/Dockerfile", "**/*.js", "**/*.ts", "**/*.tsx", "**/*.json"]

  tags = [
    "gcp-cloud-build-deploy-cloud-run",
    "gcp-cloud-build-deploy-cloud-run-managed",
    "futbol-domingos"
  ]

  service_account = "projects/${var.project_id}/serviceAccounts/${var.service_account}"
}