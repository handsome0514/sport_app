# Deployment

We use Kubernetes and Google Cloud Platform to host our application

Connect to GCP VM:

```shell
gcloud compute ssh --zone "europe-north1-a" "sub-soccer-vm-prod" --project "subsoccer-app"
```

In the VM the project for now is places here **/home/oleksandr/sport-app**

To update deployment run this:

```shell
kubectl apply -f deployment.yml
```
