import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { ChangeEvent, useCallback, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { SendMessagesProps } from "./send-messages.props";

const useSQSSendMessage = (SQSClient: SQSClient, QueueUrl: string) => {
  const sendMessage = useCallback(
    async (message: string) => {
      const input: SendMessageCommandInput = {
        QueueUrl,
        MessageBody: message,
      };
      return SQSClient.send(new SendMessageCommand(input));
    },
    [SQSClient, QueueUrl],
  );

  return sendMessage;
};

function SendMessages(props: SendMessagesProps) {
  const { SQSClient, QueueUrl, className = "" } = props;

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useSQSSendMessage(SQSClient, QueueUrl);

  const onInputChage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };
  const onSendButtonClick = async () => {
    setIsLoading(true);
    sendMessage(inputText)
      .then((output) => {
        toast.success(`Sent message ${output.MessageId}`);
        setInputText("");
      })
      .catch((error) => {
        toast.error(error.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className={className}>
      <div className="w-full flex justify-center items-center h-12 rounded-t border-2 border-gray-400 border-b-0">
        {isLoading ? (
          <BeatLoader size={15} />
        ) : (
          <button
            className="w-full h-full py-2 hover:bg-gray-300 active:bg-gray-400 "
            onClick={onSendButtonClick}
          >
            SEND
          </button>
        )}
      </div>
      <textarea
        className="w-full bg-neutral-100 disabled:bg-neutral-200 resize-none h-96 rounded-b border-2 border-gray-400 p-4 text-lg"
        disabled={isLoading}
        value={inputText}
        onChange={onInputChage}
      />
    </div>
  );
}
export default SendMessages;
