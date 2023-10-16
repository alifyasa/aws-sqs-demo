import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchCommandInput,
  DeleteMessageBatchRequestEntry,
  Message,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader, MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import { ReceiveMessagesProps } from "./receive-messages.props";

const useSQSReceiveMessage = (SQSClient: SQSClient, QueueUrl: string) => {
  const receiveMessage = useCallback(async () => {
    const input: ReceiveMessageCommandInput = {
      QueueUrl,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 1,
      WaitTimeSeconds: 3,
    };

    return SQSClient.send(new ReceiveMessageCommand(input));
  }, [SQSClient, QueueUrl]);

  return receiveMessage;
};

const useSQSDeleteMessageBatch = (SQSClient: SQSClient, QueueUrl: string) => {
  const deleteMessageBatch = useCallback(
    async (messages: DeleteMessageBatchRequestEntry[]) => {
      const input: DeleteMessageBatchCommandInput = {
        QueueUrl,
        Entries: messages,
      };

      return SQSClient.send(new DeleteMessageBatchCommand(input));
    },
    [SQSClient, QueueUrl],
  );

  return deleteMessageBatch;
};

function DisplayMessage(props: {
  index: number;
  message: Message;
  onSelect?: (id: string, message: Message) => void;
  onDeselect?: (id: string) => void;
}) {
  const { index, message, onSelect = () => {}, onDeselect = () => {} } = props;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (isSelected) {
      onSelect(message.MessageId ?? index.toString(), message);
    } else {
      onDeselect(message.MessageId ?? index.toString());
    }
  }, [isSelected, message, index, onSelect, onDeselect]);

  const onClick = () => {
    setIsSelected((prev) => !prev);
  };

  return (
    <div
      className="flex flex-row border-2 border-b-gray-400 hover:cursor-pointer "
      onClick={onClick}
    >
      <div className={"w-full p-2 flex-grow"}>
        <p className="text-xl">{message.Body}</p>
        <p className="text-xs font-light italic">{message.MessageId}</p>
      </div>
      <p className="p-4 place-self-center text-base">
        {isSelected ? "SELECTED" : ""}
      </p>
    </div>
  );
}

function ReceiveMessages(props: ReceiveMessagesProps) {
  const { SQSClient, QueueUrl, className = "" } = props;

  const [isReceiveLoading, setIsReceiveLoading] = useState(false);
  const [listOfMessages, setListOfMessages] = useState<Message[]>([]);
  const [statusState, setStatusState] = useState({
    show: true,
    message: "No Messages",
  });

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [listOfToBeDeletedMessages, setListOfToBeDeletedMessages] = useState<
    DeleteMessageBatchRequestEntry[]
  >([]);

  const receiveMessage = useSQSReceiveMessage(SQSClient, QueueUrl);
  const deleteMessageBatch = useSQSDeleteMessageBatch(SQSClient, QueueUrl);

  const onReceiveButtonClick = async () => {
    setIsReceiveLoading(true);
    setStatusState((prev) => {
      return { ...prev, show: false };
    });
    receiveMessage()
      .then((output) => {
        console.log(output);
        setListOfMessages(output.Messages ?? []);
        if ((output.Messages ?? []).length === 0) {
          setStatusState({ show: true, message: "No Message Received" });
        }
      })
      .catch((error) => {
        toast.error(error.toString());
      })
      .finally(() => {
        setIsReceiveLoading(false);
      });
  };
  const onDeleteButtonClick = async () => {
    setIsDeleteLoading(true);
    console.log(listOfToBeDeletedMessages);
    deleteMessageBatch(listOfToBeDeletedMessages)
      .then((output) => {
        output.Successful?.forEach((output) =>
          toast.success(`Successfully Deleted ${output.Id}`),
        );
        output.Failed?.forEach((output) =>
          toast.error(`Failed to Delete ${output.Id}`),
        );
        setListOfToBeDeletedMessages([]);
        setListOfMessages([]);
        setStatusState({ show: true, message: "Please Receive Again" });
      })
      .catch((error) => {
        toast.error(error.toString());
      })
      .finally(() => {
        setIsDeleteLoading(false);
      });
  };

  const onSelectDisplayMessage = useCallback((id: string, message: Message) => {
    const deleteEntry: DeleteMessageBatchRequestEntry = {
      Id: id,
      ReceiptHandle: message.ReceiptHandle,
    };
    setListOfToBeDeletedMessages((prev) => [...prev, deleteEntry]);
  }, []);
  const onDeselectDisplayMessage = useCallback((id: string) => {
    setListOfToBeDeletedMessages((prev) =>
      prev.filter((entry) => entry.Id !== id),
    );
  }, []);

  return (
    <div className={className}>
      <div className="w-full flex justify-center items-center h-12 rounded-t border-2 border-gray-400 border-b-0">
        {isReceiveLoading ? (
          <div className="w-1/2 flex justify-center">
            <BeatLoader size={15} />
          </div>
        ) : (
          <button
            className="w-1/2 h-full py-2 hover:bg-gray-300 active:bg-gray-400"
            onClick={onReceiveButtonClick}
          >
            RECEIVE
          </button>
        )}
        {isDeleteLoading ? (
          <div className="w-1/2 flex justify-center">
            <BeatLoader size={15} />
          </div>
        ) : (
          <button
            className="w-1/2 h-full py-2 hover:bg-gray-300 active:bg-gray-400"
            onClick={onDeleteButtonClick}
          >
            DELETE
          </button>
        )}
      </div>
      <div className="w-full bg-neutral-100 disabled:bg-neutral-200 resize-none h-96 rounded-b border-2 border-gray-400 text-lg">
        {statusState.show ? (
          <div className="flex items-center justify-center h-full uppercase text-2xl">
            <p>{statusState.message}</p>
          </div>
        ) : listOfMessages.length !== 0 ? (
          <div className="w-full h-full overflow-scroll">
            {listOfMessages.map((item, index) => (
              <DisplayMessage
                index={index}
                message={item}
                onSelect={onSelectDisplayMessage}
                onDeselect={onDeselectDisplayMessage}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <MoonLoader size={40} />
          </div>
        )}
      </div>
    </div>
  );
}
export default ReceiveMessages;
