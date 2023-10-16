import { SQSClient } from "@aws-sdk/client-sqs";

export interface SendMessagesProps {
  className?: string;
  SQSClient: SQSClient;
  QueueUrl: string;
}
