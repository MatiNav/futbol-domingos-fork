This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variable Management Guide

### Using the Environment Variable Management Script

This project includes a convenient script to automate the process of adding new environment variables across all necessary infrastructure files.

To add a new environment variable, run:

```bash
npm run add-env-var VAR_NAME "Description of the variable" true
```

This will update the following files:

- `infrastructure/cloud_build/cloudbuild.yaml`
- `infrastructure/cloud_build/Dockerfile`
- `infrastructure/cloud_build_trigger.tf`
- `terraform.tfvars.tf`

Then you can review the changes in the cloud_build_trigger.tf file:

```bash
git diff infrastructure/cloud_build_trigger.tf
```

If everything looks good, you can apply the changes to your infrastructure:

```bash
cd infrastructure
terraform init    # Only if you haven't initialized before
terraform plan    # Review the planned changes
terraform apply   # Apply the changes to your infrastructure
```

Then you can commit and push your changes to trigger a new build:

```bash
git add .
git commit -m "Add new environment variable"
git push
```

### How to Add or Update an Environment Variable Manually

This README explains how to properly configure and manage environment variables throughout your application's infrastructure.

## How to Add or Update an Environment Variable

Follow these steps in order to properly add a new environment variable or update an existing one:

### 1. Add Variable to `terraform.tfvars.tf`

Define your variable in the Terraform variables file:

```terraform
variable "MY_NEW_VARIABLE" {
  description = "Description of what this variable is used for"
  type        = string
  sensitive   = true  # Use for secrets that should be hidden
  default     = "default_value" # Production value
}
```

### 2. Add Substitution in Cloud Build Trigger

Update the `cloud_build_trigger.tf` file to pass the variable to Cloud Build:

```terraform:README.md
resource "google_cloudbuild_trigger" "nextjs_cloud_run_trigger" {
  # ... existing code ...

  substitutions = {
    # ... existing substitutions ...
    _MY_NEW_VARIABLE = var.MY_NEW_VARIABLE
  }

  # ... existing code ...
}
```

### 3. Add Build Argument in `cloudbuild.yaml`

Make the variable available during build by adding it to your Cloud Build configuration:

```yaml
steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      # ... existing args ...
      - "--build-arg"
      - "MY_NEW_VARIABLE=${_MY_NEW_VARIABLE}"
      # ... existing args ...
```

### 4. Update Dockerfile

Modify your Dockerfile to receive and use the environment variable:

```dockerfile
# In the builder stage if needed during build
ARG MY_NEW_VARIABLE
ENV MY_NEW_VARIABLE=${MY_NEW_VARIABLE}

# ... existing code ...

# In the runner stage if needed at runtime
ARG MY_NEW_VARIABLE
ENV MY_NEW_VARIABLE=${MY_NEW_VARIABLE}
```

### 5. Apply Terraform Changes

Deploy your updated configuration:

```bash
terraform init  # Only needed first time or when providers change
terraform plan  # Review changes
terraform apply # Apply changes
```

### 6. Commit Your Changes

This will trigger a new build and deploy

## Security Considerations

- Mark sensitive variables with `sensitive = true` in Terraform
- The `terraform.tfvars.tf` file is not committed to the repository, so it is not visible to the public.
- Never commit actual secrets to version control
