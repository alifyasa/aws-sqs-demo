import { SQSClient } from "@aws-sdk/client-sqs";
import { AWSSQSInterfaceProps } from "./aws-sqs-interface.props";
import ReceiveMessages from "./receive-messages/receive-messages";
import SendMessages from "./send-messages/send-messages";

const client = new SQSClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID as string, // "ASIAUFVMAAZTPD2PPJJR",
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY as string, // "wgm6IIyDmHE1O1xN5a2dUU/G5YbKmFr8cF8hYtdw",
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN as string,
  },
});
function AWSSQSInterface(props: AWSSQSInterfaceProps) {
  const { QueueUrl } = props;
  return (
    <div className="border-2 border-white rounded flex flex-row">
      <SendMessages
        className="w-1/2 mr-4"
        SQSClient={client}
        QueueUrl={QueueUrl}
      />
      <ReceiveMessages
        className="w-1/2 ml-4"
        SQSClient={client}
        QueueUrl={QueueUrl}
      />
    </div>
  );
}
export default AWSSQSInterface;
