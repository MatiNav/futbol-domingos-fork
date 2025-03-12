#!/bin/bash

# Add environment variable to infrastructure files
# Usage: ./add_env_var.sh VAR_NAME "Description of the variable" [is_secret]

if [ $# -lt 2 ]; then
    echo "Usage: ./add_env_var.sh VAR_NAME \"Description of the variable\" [is_secret]"
    exit 1
fi

VAR_NAME=$1
DESCRIPTION=$2
IS_SECRET=${3:-false}

echo "Adding $VAR_NAME to infrastructure files..."

# 1. Add to terraform.tfvars.tf (create if it doesn't exist)
if [ ! -f "infrastructure/terraform.tfvars.tf" ]; then
    touch infrastructure/terraform.tfvars.tf
fi

SENSITIVE=""
if [ "$IS_SECRET" = true ]; then
    SENSITIVE="sensitive   = true"
fi

cat << EOF >> infrastructure/terraform.tfvars.tf
variable "$VAR_NAME" {
  description = "$DESCRIPTION"
  type        = string
  $SENSITIVE
  default     = "" # Set your default value here
}

EOF

echo "✅ Added to terraform.tfvars.tf"

# 2. Add to cloud_build_trigger.tf substitutions
# macOS-compatible sed command
sed -i '' "/substitutions = {/a\\
\    _$VAR_NAME = var.$VAR_NAME
" infrastructure/cloud_build_trigger.tf
echo "✅ Added to cloud_build_trigger.tf"

# 3. Add to cloudbuild.yaml
# Find the line number of the last "--build-arg" entry
LAST_BUILD_ARG=$(grep -n "\- \"--build-arg\"" infrastructure/cloud_build/cloudbuild.yaml | tail -1 | cut -d: -f1)
if [ -n "$LAST_BUILD_ARG" ]; then
    NEXT_LINE=$((LAST_BUILD_ARG + 2))
    # macOS-compatible sed command - need to create a temporary file
    awk -v line="$NEXT_LINE" -v var="$VAR_NAME" '{
        if (NR == line) {
            print "      - \"--build-arg\"";
            print "      - \"" var "=${_" var "}\"";
            print $0;
        } else {
            print;
        }
    }' infrastructure/cloud_build/cloudbuild.yaml > /tmp/cloudbuild.yaml.tmp
    mv /tmp/cloudbuild.yaml.tmp infrastructure/cloud_build/cloudbuild.yaml
    echo "✅ Added to cloudbuild.yaml"
else
    echo "❌ Failed to find build-arg position in cloudbuild.yaml"
fi

# 4. Add to Dockerfile
# Add to builder stage
BUILDER_ARG_LINE=$(grep -n "ARG AUTH0_" infrastructure/cloud_build/Dockerfile | head -1 | cut -d: -f1)
if [ -n "$BUILDER_ARG_LINE" ]; then
    LAST_BUILDER_ARG_LINE=$(grep -n "ARG AUTH0_BASE_URL" infrastructure/cloud_build/Dockerfile | head -1 | cut -d: -f1)
    if [ -n "$LAST_BUILDER_ARG_LINE" ]; then
        # macOS-compatible approach
        NEXT_LINE=$((LAST_BUILDER_ARG_LINE + 1))
        awk -v line="$NEXT_LINE" -v var="$VAR_NAME" '{
            if (NR == line) {
                print "ARG " var;
                print $0;
            } else {
                print;
            }
        }' infrastructure/cloud_build/Dockerfile > /tmp/Dockerfile.tmp
        mv /tmp/Dockerfile.tmp infrastructure/cloud_build/Dockerfile
        echo "✅ Added ARG to builder stage in Dockerfile"
    else
        echo "❌ Failed to find builder ARG block end in Dockerfile"
    fi

    BUILDER_ENV_LINE=$(grep -n "ENV MONGODB_URI" infrastructure/cloud_build/Dockerfile | head -1 | cut -d: -f1)
    if [ -n "$BUILDER_ENV_LINE" ]; then
        LAST_BUILDER_ENV_LINE=$(grep -n "AUTH0_BASE_URL=\${AUTH0_BASE_URL}" infrastructure/cloud_build/Dockerfile | head -1 | cut -d: -f1)
        if [ -n "$LAST_BUILDER_ENV_LINE" ]; then
            # macOS-compatible approach
            awk -v line="$LAST_BUILDER_ENV_LINE" -v var="$VAR_NAME" '{
                if (NR == line) {
                    print "    " var "=${" var "} \\";
                    print $0;
                } else {
                    print;
                }
            }' infrastructure/cloud_build/Dockerfile > /tmp/Dockerfile.tmp
            mv /tmp/Dockerfile.tmp infrastructure/cloud_build/Dockerfile
            echo "✅ Added ENV to builder stage in Dockerfile"
        else
            echo "❌ Failed to find builder ENV block end in Dockerfile"
        fi
    else
        echo "❌ Failed to find builder ENV position in Dockerfile"
    fi
else
    echo "❌ Failed to find builder section in Dockerfile"
fi

# Add to runner stage
RUNNER_ARG_LINE=$(grep -n "ARG MONGODB_URI" infrastructure/cloud_build/Dockerfile | tail -1 | cut -d: -f1)
if [ -n "$RUNNER_ARG_LINE" ]; then
    LAST_RUNNER_ARG_LINE=$(grep -n "ARG AUTH0_BASE_URL" infrastructure/cloud_build/Dockerfile | tail -1 | cut -d: -f1)
    if [ -n "$LAST_RUNNER_ARG_LINE" ]; then
        # macOS-compatible approach
        NEXT_LINE=$((LAST_RUNNER_ARG_LINE + 1))
        awk -v line="$NEXT_LINE" -v var="$VAR_NAME" '{
            if (NR == line) {
                print "ARG " var;
                print $0;
            } else {
                print;
            }
        }' infrastructure/cloud_build/Dockerfile > /tmp/Dockerfile.tmp
        mv /tmp/Dockerfile.tmp infrastructure/cloud_build/Dockerfile
        echo "✅ Added ARG to runner stage in Dockerfile"
    else
        echo "❌ Failed to find runner ARG block end in Dockerfile"
    fi

    RUNNER_ENV_LINE=$(grep -n "ENV MONGODB_URI" infrastructure/cloud_build/Dockerfile | tail -1 | cut -d: -f1)
    if [ -n "$RUNNER_ENV_LINE" ]; then
        LAST_RUNNER_ENV_LINE=$(grep -n "AUTH0_BASE_URL=\${AUTH0_BASE_URL}" infrastructure/cloud_build/Dockerfile | tail -1 | cut -d: -f1)
        if [ -n "$LAST_RUNNER_ENV_LINE" ]; then
            # macOS-compatible approach
            awk -v line="$LAST_RUNNER_ENV_LINE" -v var="$VAR_NAME" '{
                if (NR == line) {
                    print "    " var "=${" var "} \\";
                    print $0;
                } else {
                    print;
                }
            }' infrastructure/cloud_build/Dockerfile > /tmp/Dockerfile.tmp
            mv /tmp/Dockerfile.tmp infrastructure/cloud_build/Dockerfile
            echo "✅ Added ENV to runner stage in Dockerfile"
        else
            echo "❌ Failed to find runner ENV block end in Dockerfile"
        fi
    else
        echo "❌ Failed to find runner ENV position in Dockerfile"
    fi
fi

# Enhanced ending message with cool formatting
echo ""
echo "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨"
echo "🚀 ENV VARIABLE ADDED SUCCESSFULLY! 🚀"
echo "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨"
echo ""
echo "Variable '$VAR_NAME' has been added to:"
echo "  📄 terraform.tfvars.tf"
echo "  📄 cloud_build_trigger.tf"
echo "  📄 cloudbuild.yaml"
echo "  📄 Dockerfile (both builder and runner stages)"
echo ""
echo "🔍 Next steps:"
echo "  1. Review changes in cloud_build_trigger.tf:"
echo "     git diff infrastructure/cloud_build_trigger.tf"
echo ""
echo "  2. If everything looks good, apply your Terraform changes:"
echo "     cd infrastructure"
echo "     terraform init    # Only if you haven't initialized before"
echo "     terraform plan    # Review the planned changes"
echo "     terraform apply   # Apply the changes to your infrastructure"
echo ""
echo "  3. Commit and push your changes to trigger a new build"
echo ""
echo "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨" 