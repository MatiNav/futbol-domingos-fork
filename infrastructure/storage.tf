

locals {
  description = "The URL of the app"
  app_url     = "https://${var.cloud_service_name}-${var.service_account_number}.${var.region}.run.app"
}


resource "google_storage_bucket" "tf-futbol-app-bucket" {
  name          = "tf-futbol-app-bucket"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin = [
      "https://1b71-181-12-215-5.ngrok-free.app",
      "https://futbol-gamma.vercel.app",
      "http://localhost:3000",
      "https://df52-2800-810-458-1d0a-30fb-daa8-7c2a-582b.ngrok-free.app",
      "http://127.0.0.1:4000",
      "http://127.0.0.1:3000",
      local.app_url
    ]
    method          = ["GET", "HEAD", "PUT", "POST"]
    response_header = ["Content-Type", "Authorization"]
    max_age_seconds = 3600
  }
}
