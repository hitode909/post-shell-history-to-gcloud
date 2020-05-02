deploy:
	gcloud beta functions deploy accept --trigger-http --runtime=nodejs8 --env-vars-file=env.yaml --region=asia-northeast1
tail:
	gcloud beta functions logs read
project:
	gcloud projects create shell-history-`whoami`
	gcloud config set project shell-history-`whoami`
	gcloud app create
	make deploy
	make index
index:
	gcloud datastore indexes create ./index.yaml
