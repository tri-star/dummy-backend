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

```bash
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

ローカルの場合：

```bash
npx sls invoke local -f hello --path src/functions/hello/mock.json
```

または

```bash
npx supabase start
serverless offline

curl --location --request POST 'https://localhost:3000/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## マイグレーション

```bash
npx supabase migration new create_xxxx_table
# ローカルに反映
npx supabase db reset

# 型定義に反映
npx supabase gen types typescript --project-id bqhadhfibqbahdnwzlov > src/lib/supabase/database.ts

# デプロイ
npx supabase db pull
npx supabase db push
```

## Terraform

```bash
# 事前準備：AWS SSOのStart URLで"Option 2: Manually add a profile to your AWS credentials file (Short-term credentials)"などを使用し、~/.aws/credentialsに一時的なprofileを作成。

export AWS_PROFILE=xxxx

cd terraform/dev
terraform plan
terraform apply
```
