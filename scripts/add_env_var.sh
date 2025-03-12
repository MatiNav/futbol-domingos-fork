#!/bin/bash

# Add environment variable to infrastructure files
# Usage: ./add_env_var.sh VAR_NAME "ACTUAL_VALUE" [is_secret]

if [ $# -lt 2 ]; then
    echo "Usage: ./add_env_var.sh VAR_NAME \"ACTUAL_VALUE\" [is_secret]"
    exit 1
fi

VAR_NAME=$1
VALUE=$2
IS_SECRET=${3:-false}

# Save the list of terraform files before any changes
git ls-files --modified 'infrastructure/*.tf' > /tmp/pre_modified_files.txt 2>/dev/null || touch /tmp/pre_modified_files.txt

echo "Adding $VAR_NAME with value '$VALUE' to infrastructure files..."

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
  description = "The $VAR_NAME variable"
  type        = string
  $SENSITIVE
  default     = "$VALUE" # Set from add_env_var.sh script
}

EOF

echo "✅ Added to terraform.tfvars.tf with value: $VALUE"

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

# Check which terraform files were modified
git ls-files --modified 'infrastructure/*.tf' > /tmp/post_modified_files.txt 2>/dev/null || touch /tmp/post_modified_files.txt

# Check if only our terraform modifications exist
ONLY_ENV_VAR_CHANGES=true

# Check if any other .tf files were already modified before we ran this script
if [ -s /tmp/pre_modified_files.txt ]; then
    ONLY_ENV_VAR_CHANGES=false
    echo "⚠️ There were already terraform files modified before adding this variable."
fi

# Check if our diff contains only the env var addition
if [ "$ONLY_ENV_VAR_CHANGES" = true ]; then
    while read -r file; do
        # Get diff for this file
        git diff "$file" | grep -v "^[+-]variable \"$VAR_NAME\"" | grep -v "^[+-]  description" | grep -v "^[+-]  type" | \
        grep -v "^[+-]  sensitive" | grep -v "^[+-]  default" | grep -v "^[+-]}" | grep -v "^[+-]$" | \
        grep -v "^[+-]    _$VAR_NAME = var.$VAR_NAME" | grep -E "^\+|^-" > /tmp/other_changes.txt
        
        if [ -s /tmp/other_changes.txt ]; then
            ONLY_ENV_VAR_CHANGES=false
            echo "⚠️ Found other changes in $file besides adding $VAR_NAME"
            break
        fi
    done < /tmp/post_modified_files.txt
fi

# Auto-apply if only env var changes
if [ "$ONLY_ENV_VAR_CHANGES" = true ]; then
    echo ""
    echo "🔍 Only detected changes related to adding $VAR_NAME"
    echo "💡 Automatically applying Terraform changes..."
    
    # Change to infrastructure directory
    cd infrastructure || exit
    
    # Check if terraform needs initialization
    if [ ! -d ".terraform" ]; then
        echo "🔧 Running terraform init..."
        terraform init
    fi
    
    echo "🔧 Running terraform apply..."
    terraform apply -auto-approve
    
    if [ $? -eq 0 ]; then
        echo "✅ Terraform changes applied successfully!"
        cd ..
    else
        echo "❌ Terraform apply failed! Please check the errors above."
        cd ..
        exit 1
    fi
else
    echo ""
    echo "⚙️ Detected other terraform changes - skipping auto-apply"
    echo "👉 You should manually review and apply changes:"
    echo "  cd infrastructure"
    echo "  terraform plan    # Review changes"
    echo "  terraform apply   # Apply changes"
fi

# Enhanced ending message with cool formatting
echo ""
echo "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨"
echo "🚀 ENV VARIABLE ADDED SUCCESSFULLY! 🚀"
echo "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨"
echo ""
echo "Variable '$VAR_NAME' has been added with value '$VALUE' to:"
echo "  📄 terraform.tfvars.tf"
echo "  📄 cloud_build_trigger.tf"
echo "  📄 cloudbuild.yaml"
echo "  📄 Dockerfile (both builder and runner stages)"
echo ""

# Only show next steps if we didn't auto-apply
if [ "$ONLY_ENV_VAR_CHANGES" = false ]; then
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
fi

echo "  3. Commit and push your changes to trigger a new build"
echo ""
echo "✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨" 