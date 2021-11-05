## CMD
```bash
 gcloud config set project ysamir-data-processing-test
 gcloud auth application-default login 
 #[C:\Users\Windows\AppData\Roaming\gcloud\application_default_credentials.json]
 gcloud pubsub topics create input-data --message-retention-duration=604800s
 gcloud pubsub topics delete input-data

 #build and deploy
 gcloud builds submit --config=cloudbuild.yaml  --substitutions=_IMAGE_VERSION="1.0.0" .
 gcloud run deploy input-api --image 'eu.gcr.io/${PROJECT_ID}/input-api:latest' \ 
         --region 'europe-west1' \
        --port '3000' \
        --cpu 1 \
        --memory '512Mi' \
        --concurrency 10 \
        --platform managed \
        --set-env-vars 'PUBSUB_TOPIC_INPUT_DATA=projects/ysamir-data-processing-test/topics/input-data' \
        --set-env-vars 'PUBSUB_CLIENT_ID=input-api 

```
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
