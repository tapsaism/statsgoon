ECHO "Compressing folder"
pushd /Users/olliiivonen/Dabblings/statsgoon/statsgoon-lambda/
zip -vr $1.zip $1
popd

ECHO "Moving file"
mv /Users/olliiivonen/Dabblings/statsgoon/statsgoon-lambda/$1.zip /Users/olliiivonen/Dabblings/statsgoon/statsgoon-utils/temp/$1.zip

ECHO "Updating AWS Lambda"
aws lambda update-function-code --function-name $1 --zip-file fileb://temp/$1.zip --region us-east-1
