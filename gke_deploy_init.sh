gcloud iam workload-identity-pools create github-actions \
    --location="global" \
    --description="GitHub Actions" \
    --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github-actions-oidc \
    --location="global" \
    --workload-identity-pool=github-actions \
    --issuer-uri="https://token.actions.githubusercontent.com/" \
    --attribute-mapping="google.subject=assertion.sub"

SERVICE_ACCOUNT=$(gcloud iam service-accounts create github-actions-workflow \
  --display-name "GitHub Actions workflow" \
  --format "value(email)")

gcloud projects add-iam-policy-binding $(gcloud config get-value core/project) \
  --member serviceAccount:$SERVICE_ACCOUNT \
  --role roles/artifactregistry.writer

gcloud projects add-iam-policy-binding $(gcloud config get-value core/project) \
  --member serviceAccount:$SERVICE_ACCOUNT \
  --role roles/container.developer


###############
SUBJECT=repo:valkohelmi/sport-app:ref:refs/heads/deploy
PROJECT_NUMBER=$(gcloud projects describe $(gcloud config get-value core/project) --format='value(projectNumber)')

gcloud iam service-accounts add-iam-policy-binding $SERVICE_ACCOUNT \
  --role=roles/iam.workloadIdentityUser \
  --member="principal://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions/subject/$SUBJECT"

########

gcloud artifacts repositories create subsocker-app \
  --repository-format=docker \
  --location=us-central1

gcloud projects add-iam-policy-binding $(gcloud config get-value core/project) \
  --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/artifactregistry.reader

gcloud container clusters create subsocker-app \
  --enable-ip-alias \
  --zone us-central1-a

echo "Project ID: $(gcloud config get-value core/project)"
echo "Project Number: $(gcloud projects describe $(gcloud config get-value core/project) --format=value\(projectNumber\))"