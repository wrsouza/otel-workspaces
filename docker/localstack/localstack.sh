#!/bin/bash
declare -a NAMES=(
    "process-payment"
)

AWS_EXEC="awslocal"
REGION="us-east-1"

echo 'Init Create QUEUES AND TOPIC'

for NAME in "${NAMES[@]}"
do
    QUEUE_URL=$($AWS_EXEC sqs --region $REGION create-queue --queue-name ${NAME} --query 'QueueUrl' --output text)
    QUEUE_ARN=$($AWS_EXEC sqs --region $REGION get-queue-attributes --queue-url $QUEUE_URL --attribute-name QueueArn --query 'Attributes.QueueArn' --output text)
    echo $QUEUE_URL
    echo $QUEUE_ARN

    TOPIC_ARN=$($AWS_EXEC sns --region $REGION create-topic --name ${NAME}-topic --query 'TopicArn' --output text)
    $AWS_EXEC sns --region $REGION subscribe --topic-arn $TOPIC_ARN --protocol sqs --notification-endpoint $QUEUE_ARN > /dev/null
    echo $TOPIC_ARN

    DLQ_URL=$($AWS_EXEC sqs --region $REGION create-queue --queue-name ${NAME}-dlq --query 'QueueUrl' --output text)
    DLQ_ARN=$($AWS_EXEC sqs --region $REGION get-queue-attributes --queue-url $DLQ_URL --attribute-name QueueArn --query 'Attributes.QueueArn' --output text)
    echo $DLQ_URL
    echo $DLQ_ARN

    $AWS_EXEC sqs --region $REGION set-queue-attributes --queue-url $QUEUE_URL --attributes RedrivePolicy="'"{\"deadLetterTargetArn\":\"$DLQ_ARN\"\,\"maxReceiveCount\":10}"'"
done

echo 'All Complete Services Created'