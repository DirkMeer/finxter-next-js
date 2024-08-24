"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import { ChatMessage } from "../types/chatMessage";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mb-4 w-full">
      <label className="block mb-2 text-gray-700">{label}:</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded bg-white"
      />
    </div>
  );
};

const ChatBubble: React.FC<ChatMessage> = ({
  text,
  sender,
  isAnswer = false,
  timeSent: time_sent,
}) => {
  const chatLocation = isAnswer ? "chat-end" : "chat-start";
  return (
    <div className={`chat ${chatLocation}`}>
      <div className="chat-header">
        {sender === "You" ? (
          <span className="font-bold mr-1">You</span>
        ) : (
          <span className="font-bold text-custom-grey mr-1">{sender}</span>
        )}
        <time className="text-xs opacity-50">
          {time_sent.toLocaleTimeString()}
        </time>
      </div>
      <div className="chat-bubble">{text}</div>
    </div>
  );
};

const BlockbusterChat: React.FC = () => {
  const [movieName, setMovieName] = useState<string>("");
  const [movieCharacter, setMovieCharacter] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const chatHistoryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);

    const questionChatMessage: ChatMessage = {
      text: question,
      sender: "You",
      timeSent: new Date(),
    };

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      questionChatMessage,
    ]);

    const response = await fetch("/api/blockbuster_v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieName,
        movieCharacter,
        question,
        chatHistory,
      }),
    });

    const data: { answer: string } = await response.json();

    const answerChatMessage: ChatMessage = {
      text: data.answer,
      sender: movieCharacter,
      isAnswer: true,
      timeSent: new Date(),
    };

    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      answerChatMessage,
    ]);

    setQuestion("");
    setIsLoading(false);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      setter(event.target.value);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blockbuster Chat</h1>

      {/* Initial input form for character and first question */}
      {!isSubmitted && (
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <InputField
              label="Movie Character"
              value={movieCharacter}
              onChange={handleInputChange(setMovieCharacter)}
              disabled={isSubmitted}
            />
            <InputField
              label="Movie Name"
              value={movieName}
              onChange={handleInputChange(setMovieName)}
              disabled={isSubmitted}
            />
          </div>
          <InputField
            label="Question"
            value={question}
            onChange={handleInputChange(setQuestion)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-custom-grey text-white rounded hover:bg-blue-900"
            disabled={isLoading}
          >
            Ask
          </button>
        </form>
      )}

      {/* Display chat history */}
      {chatHistory && (
        <div
          ref={chatHistoryRef}
          className="mt-6 max-h-[70vh] overflow-y-scroll"
        >
          {chatHistory.map((chatMessage: ChatMessage, index) => (
            <ChatBubble
              key={index}
              text={chatMessage.text}
              isAnswer={chatMessage.isAnswer}
              sender={chatMessage.sender}
              timeSent={chatMessage.timeSent}
            />
          ))}
        </div>
      )}

      {/* Loading message */}
      {isLoading && (
        <div className="mt-6 text-gray-700">Asking {movieCharacter}...</div>
      )}

      {/* Display form for follow up questions */}
      {isSubmitted && !isLoading && (
        <form className="mt-3" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <InputField
              label="Question"
              value={question}
              onChange={handleInputChange(setQuestion)}
            />
            <button
              type="submit"
              className="px-4 py-2 h-10 mt-8 bg-custom-grey text-white rounded hover:bg-blue-900"
              disabled={isLoading}
            >
              Ask
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BlockbusterChat;
