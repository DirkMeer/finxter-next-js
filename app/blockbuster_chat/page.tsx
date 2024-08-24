"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

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

const BlockbusterChat: React.FC = () => {
  const [movieName, setMovieName] = useState<string>("");
  const [movieCharacter, setMovieCharacter] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);

    const response = await fetch("/api/blockbuster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieName, movieCharacter, question }),
    });

    const data: { answer: string } = await response.json();
    setAnswer(data.answer);
    setIsLoading(false);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      setter(event.target.value);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blockbuster Chat</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <InputField
            label="Movie Name"
            value={movieName}
            onChange={handleInputChange(setMovieName)}
            disabled={isSubmitted}
          />
          <InputField
            label="Movie Character"
            value={movieCharacter}
            onChange={handleInputChange(setMovieCharacter)}
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          Ask {movieCharacter}
        </button>
      </form>
      {isLoading && (
        <div className="mt-6 text-gray-700">Asking {movieCharacter}...</div>
      )}
      {answer && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default BlockbusterChat;