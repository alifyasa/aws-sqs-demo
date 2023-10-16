import { ChangeEvent, useRef, useState } from "react";
import { TextInputProps } from "./text-input.props";

function TextInput(props: TextInputProps) {
  const { inputValue, setInputValue } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  const onInputChage = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const onClickSave = () => {
    inputRef.current?.setSelectionRange(0, 0);
    setIsSaved((prev) => !prev);
    console.log(inputValue);
  };

  return (
    <div className="flex flex-row pb-8">
      <input
        ref={inputRef}
        className="border border-gray-400 disabled:border-gray-100 rounded flex-grow p-3 text-lg font-mono bg-neutral-100 disabled:bg-neutral-200 text-overflow text-ellipsis"
        value={inputValue}
        onChange={onInputChage}
        disabled={isSaved}
        placeholder="AWS SQS Queue URL"
      />
      <button
        className="ml-2 px-6 border border-gray-500 rounded hover:bg-gray-300 active:bg-gray-400 text-base w-28"
        onClick={onClickSave}
      >
        {isSaved ? "EDIT" : "SAVE"}
      </button>
    </div>
  );
}

export default TextInput;
