# aws-lambda-for-kinesis

--

# AWS Kinesis

## Set variables

```
$ KINESIS_STREAM_NAME=test_kinesis_stream
```

## Create kinesis

```
$ aws kinesis create-stream --stream-name $KINESIS_STREAM_NAME --shard-count 1
$ aws kinesis list-streams
{
		"StreamNames": [
				"test_kinesis_stream"
						]
}
```

## Describe kinesis stream

Describe kinesis stream information and check 'StreamARM'

```
$ aws kinesis describe-stream  --stream-name $KINESIS_STREAM_NAME
{
		"StreamDescription": {
				"StreamStatus": "ACTIVE",
						"StreamName": "test_kinesis_stream",
						"StreamARN": "********************** ",
						"Shards": [
						{
								"ShardId": "shardId-000000000000",
								"HashKeyRange": {
										"EndingHashKey": "********************************",
										"StartingHashKey": "0"
								},
								"SequenceNumberRange": {
										"StartingSequenceNumber": "******************************"
								}
						}
				]
		}
}
```

## Put record

"Data" is needed to decode base64.

```
$ aws kinesis put-record --stream-name $KINESIS_STREAM_NAME --partition-key 1 --data testdata
....
"Records": [
{
		"PartitionKey": "1",
		"Data": "dGVzdGRhdGE=",
....
```

## How to get records

shard-iterator-type is "TRIM_HORIZON" or "LATEST"

```
$ aws kinesis get-shard-iterator --shard-id shardId-000000000000 --stream-name $KINESIS_STREAM_NAME --shard-iterator-type LATEST
{
	"ShardIterator": "AAAAAAAAAAG6EH0nqAwW67aq0gx1h1dzR43tWv2tSHP7pBl0OkzlLXMqPT00Nj/tEQNx5+jVS6aevoJ4r291pbWWqcR0/1TWWSGU0mxkm+TUpfbGI11088tA8KDjXBOKpTKZeBBUq/o4hPSOIGBVFycCb8UWF7vsngAHm00ux/Xt215yG+hkCUFSlcdIqCTtT0CbL7yQUt1w/2cfIkWS1yf6k6CLD39i6k4cnmsKVVoqzlKkwVTs8g=="
}

$ aws kinesis get-records --shard-iterator "AAAAAAAAAAG6EH0nqAwW67aq0gx1h1dzR43tWv2tSHP7pBl0OkzlLXMqPT00Nj/tEQNx5+jVS6aevoJ4r291pbWWqcR0/1TWWSGU0mxkm+TUpfbGI11088tA8KDjXBOKpTKZeBBUq/o4hPSOIGBVFycCb8UWF7vsngAHm00ux/Xt215yG+hkCUFSlcdIqCTtT0CbL7yQUt1w/2cfIkWS1yf6k6CLD39i6k4cnmsKVVoqzlKkwVTs8g=="
{
	"Records": [],
	"NextShardIterator": "AAAAAAAAAAHWuboYcEwst9x4nzjFhvBTlqSVM77WwTLmMLSu7F5eKsDg7KqUpUdSdLiRamFxxuHMeN6yt/rjM0rXarQQo2h42WX1ByUDJJmZNGcE364Z6A9ZWNHW88gJBBJH7g7DzL9DpThXEDKZVTdogb9Z5qUdqJs90ULbGTiSRWc5IZcesGSMd7WfILnrPA52dgp4jyblPCQuxk9LtgpDKfD72XOa4X2zPkZDdO6qUWbH5TNMzA=="
}
```

--

# AWS Lambda

## Set variables & npm packages

```
$ FUNCTION_NAME={YOUR_FUNCTION_NAME}
$ ROLE_NAME=arn:aws:iam::{YOUR_ROLE_NUMBER}:{YOUR_ROLE_NAME}
```

```
$ npm install sprintf
$ npm install moment
$ npm install node-zip
```

## Create zip file

```
$ zip -r myLambdaFunction.zip lambda-to-s3.js node_modules
```

## Upload lambda zip file

```
$ aws lambda upload-function --function-name=$FUNCTION_NAME --function-zip=myLambdaFunction.zip --runtime="nodejs4.3" --role=$ROLE_NAME --handler=lambda-to-s3.handler --mode=event
```

