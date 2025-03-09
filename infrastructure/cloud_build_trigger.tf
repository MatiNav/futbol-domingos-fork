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

  filename = "infrastructure/cloud_build/cloudbuild.yaml"  # Cloud Build configuration file path in repo

  included_files = ["infrastructure/cloud_build/cloudbuild.yaml", "infrastructure/cloud_build/Dockerfile", "**/*.js", "**/*.ts", "**/*.tsx", "**/*.json"]

  tags = [
    "gcp-cloud-build-deploy-cloud-run",
    "gcp-cloud-build-deploy-cloud-run-managed",
    "futbol-domingos"
  ]

  service_account = "projects/${var.project_id}/serviceAccounts/${var.service_account}"
}