'use strict';
console.log('Loading function');

var AWS = require('aws-sdk');
var util = require('util');
var s3 = new AWS.S3();
var sprintf = require('sprintf').sprintf;
var moment = require('moment');

const LINE_TERMINATOR = '\r\n';
const S3_BUKET_NAME = 'test-kinesis-streams';
const S3_PREFIX = 'prefix_test';
const STREAM_NAME = 'Stream_Name';
const SHARD_ID = 1;

exports.handler = (event, context, callback) => {
		//
		if ( typeof event.Records == 'undefined')
		{
				console.log('Records is undefined');
				callback(null, `event.Records is empty.`);
				return;
		}

		var records = [];
		event.Records.forEach((record) => {
						// Kinesis data is base64 encoded so decode here
						const payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
						console.log('Decoded payload:', payload);
						records.push(payload);
						});
		console.log('record count = ' + records.length);

		put_to_s3(records.join(LINE_TERMINATOR));

		callback(null, `Successfully processed ${event.Records.length} records.`);
};

function put_to_s3(data) {
		console.log('Execute put_to_s3 function');
		var params = { 
            Bucket: S3_BUKET_NAME, 
            Key: get_s3_key(),
            Body: data,
            ContentType: "application/json"
        };
		s3.putObject(params, function(err, data) {
						if (err) {
								console.log(err)
						} else { 
								console.log("Successfully uploaded data to myBucket/myKey");
						}
				});
}

function get_s3_key() {
    moment = moment();
        return sprintf("%s%s%s-%s-%s-%s",
                S3_PREFIX,
                moment.format('YYYY/MM/DD/HH/'),
                STREAM_NAME,
                SHARD_ID,
                moment.format('YYYY-MM-DD-HH-mm-ss'),
                guid()
            );
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
