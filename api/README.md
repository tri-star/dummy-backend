# Dummy Backend

## 動作確認

```
cd api
sam build
sam local start-api
```

## ログ確認方法

```
api$ sam logs -n DummyBackendFunction --stack-name api --tail
```
