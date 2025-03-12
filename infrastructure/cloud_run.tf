

resource "google_cloud_run_service" "futbol-domingos-2" {

  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].image,
    ]
  }

  name     = var.cloud_service_name
  location = var.region

  template {
    spec {
      containers {
        image = "us-central1-docker.pkg.dev/${var.project_id}/cloud-run-source-deploy/${var.github_repo_name}/${var.cloud_service_name}:latest"
        ports {
          container_port = 3000
        }
        # Lower resource limits to stay within free tier
        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi" # Minimal memory to stay in free tier
          }
        }
      }
      # Scale to zero when not in use to minimize costs
      container_concurrency = 80
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"     = "5"    # Lower max instances
        "autoscaling.knative.dev/minScale"     = "0"    # Scale to zero when not in use
        "run.googleapis.com/cpu-throttling"    = "true" # Request-based billing
        "run.googleapis.com/startup-cpu-boost" = "true" # Faster cold starts
      }
    }
  }
}

# IAM policy to make the service publicly accessible
resource "google_cloud_run_service_iam_member" "public_access" {
  service  = google_cloud_run_service.futbol-domingos-2.name
  location = google_cloud_run_service.futbol-domingos-2.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
