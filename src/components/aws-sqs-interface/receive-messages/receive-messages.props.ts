import { SQSClient } from "@aws-sdk/client-sqs";

export interface ReceiveMessagesProps {
  className?: string;
  SQSClient: SQSClient;
  QueueUrl: string;
}
