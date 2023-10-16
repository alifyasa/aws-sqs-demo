import { useState } from "react";
import "./App.css";
import { AWSSQSInterface, TextInput } from "./components";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [SQSQueueUrl, setSQSQueueUrl] = useState("");
  return (
    <div className="w-screen h-screen text-neutral-900 p-16">
      <h1 className="mb-12 text-4xl">AWS SQS Demo</h1>
      <TextInput inputValue={SQSQueueUrl} setInputValue={setSQSQueueUrl} />
      <AWSSQSInterface QueueUrl={SQSQueueUrl} />
      <ToastContainer />
    </div>
  );
}

export default App;
