# Dummy Backend

## デプロイ

```bash
export AWS_SDK_LOAD_CONFIG=1
serverless deploy --aws-profile [PROFILE名]
# または、npx sls deploy
```

## 動作確認

Postman などで以下のリクエストを実行

- URL: デプロイ後に表示される URL
- HTTP Method: POST
- Content Type: application/json
- Body: {name: 'abc'}

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

ローカルの場合：

```
npx sls invoke local -f hello --path src/functions/hello/mock.json
```

または

```
serverless offline

curl --location --request POST 'https://localhost:3000/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```
