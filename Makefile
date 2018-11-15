deploy:
	gcloud beta functions deploy accept --project shell-history --trigger-http --runtime=nodejs8 --env-vars-file=env.yaml --region=asia-northeast1
tail:
	gcloud beta functions logs read
index:
	gcloud datastore indexes create ./index.yaml
