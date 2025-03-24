/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiYoutube,
  FiImage,
  FiMusic,
  FiLock,
  FiSave,
} from "react-icons/fi";
import { IoText } from "react-icons/io5";
import { RiLockPasswordLine, RiQuestionAnswerLine } from "react-icons/ri";
import { MdOutlineQuiz } from "react-icons/md";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { KryptTypeEnum } from "@/app/_hooks/user/krypt/krypt.interface";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { useRouter } from "next/navigation";
import authUserWrapper from "@/app/_utils/middlewares/userAuth";

// Type definitions
type ContentItem = {
  type: "text" | "image" | "sound";
  content: string;
};

type Question = {
  question: string;
  options: string[];
  answer: string;
  index: number;
};

type KryptData = {
  title: string;
  description: string;
  content: ContentItem[];
  type: KryptTypeEnum;
  draft: boolean;
  questions: Question[];
};

const CreateKryptForm = () => {
  // Form step state
  const [step, setStep] = useState<number>(1);

  // Krypt data state
  const [kryptData, setKryptData] = useState<KryptData>({
    title: "",
    description: "",
    content: [],
    type: KryptTypeEnum.NO_LOCK,
    draft: true,
    questions: [],
  });

  // Current content item being edited
  const [currentContent, setCurrentContent] = useState<ContentItem>({
    type: "text",
    content: "",
  });

  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "",
    options: ["", ""],
    answer: "",
    index: 0,
  });

  const router = useRouter();

  // Handle basic info changes
  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setKryptData({
      ...kryptData,
      [name]: value,
    });
  };

  // Handle content type change
  const handleContentTypeChange = (type: "text" | "image" | "sound") => {
    setCurrentContent({
      ...currentContent,
      type,
    });
  };

  // Handle content value change
  const handleContentValueChange = (value: string) => {
    setCurrentContent({
      ...currentContent,
      content: value,
    });
  };

  // Add content item to krypt
  const addContentItem = () => {
    if (currentContent.content.trim()) {
      setKryptData({
        ...kryptData,
        content: [...kryptData.content, { ...currentContent }],
      });
      setCurrentContent({
        type: "text",
        content: "",
      });
    }
  };

  // Remove content item
  const removeContentItem = (index: number) => {
    const newContent = [...kryptData.content];
    newContent.splice(index, 1);
    setKryptData({
      ...kryptData,
      content: newContent,
    });
  };

  // Handle lock type change
  const handleLockTypeChange = (type: KryptTypeEnum) => {
    // Reset questions if changing to no lock
    if (type === "no lock") {
      setKryptData({
        ...kryptData,
        type,
        questions: [],
      });
    } else {
      setKryptData({
        ...kryptData,
        type,
      });
    }
  };

  // Handle question changes
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion({
      ...currentQuestion,
      [name]: value,
    });
  };

  // Handle option changes
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  // Add option to question (max 3)
  const addOption = () => {
    if (currentQuestion.options.length < 3) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, ""],
      });
    }
  };

  // Remove option from question (minimum 2)
  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      const newOptions = [...currentQuestion.options];
      newOptions.splice(index, 1);
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      });
    }
  };

  // Add question to krypt
  const addQuestion = () => {
    // For passcode, we only need the answer (the passcode value)
    if (kryptData.type === "passcode") {
      if (currentQuestion.answer.trim()) {
        // For passcode, create a simplified question object
        const passcodeQuestion = {
          question: "Enter passcode:", // Using a placeholder question
          options: [],
          answer: currentQuestion.answer.trim(),
          index: 1,
        };

        // Replace any existing questions for passcode type
        setKryptData({
          ...kryptData,
          questions: [passcodeQuestion],
        });

        // Reset form
        setCurrentQuestion({
          question: "",
          options: ["", ""],
          answer: "",
          index: 0,
        });
      }
    }
    // For quiz and multiple choice
    else if (currentQuestion.question.trim() && currentQuestion.answer.trim()) {
      const newQuestion = {
        ...currentQuestion,
        index: kryptData.questions.length + 1,
      };

      setKryptData({
        ...kryptData,
        questions: [...kryptData.questions, newQuestion],
      });

      // Reset form
      setCurrentQuestion({
        question: "",
        options: ["", ""],
        answer: "",
        index: 0,
      });
    }
  };

  // Remove question
  const removeQuestion = (index: number) => {
    const newQuestions = [...kryptData.questions];
    newQuestions.splice(index, 1);

    // Update indexes for remaining questions
    const updatedQuestions = newQuestions.map((q, i) => ({
      ...q,
      index: i + 1,
    }));

    setKryptData({
      ...kryptData,
      questions: updatedQuestions,
    });
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create a deep copy of kryptData to avoid modifying the original state
    const submissionData = JSON.parse(JSON.stringify(kryptData));

    // Handle questions based on krypt type
    if (submissionData.type === KryptTypeEnum.NO_LOCK) {
      // For no lock type, remove questions completely
      delete submissionData.questions;
    } else if (submissionData.type === KryptTypeEnum.PASSCODE) {
      // For passcode, keep only the answer field in questions
      submissionData.questions = submissionData.questions.map(
        (q: { answer: any; index: any }) => ({
          answer: q.answer,
          index: q.index,
        })
      );
    } else if (submissionData.type === KryptTypeEnum.QUIZ) {
      // For quiz, remove options from questions
      submissionData.questions = submissionData.questions.map(
        (q: { question: any; answer: any; index: any }) => ({
          question: q.question,
          answer: q.answer,
          index: q.index,
        })
      );
    }
    // For multiple choice, keep all fields (no changes needed)

    console.log("Submitting Krypt:", submissionData);
    console.log(submissionData.content);

    const data = await UserKryptService.createKrypt(submissionData);
    console.log(data);

    if (data.success) {
      toastAlert({
        type: ToastType.success,
        message: "Krypt created successfully!",
      });
      router.push(`/dashboard`);
    } else {
      toastAlert({
        type: ToastType.error,
        message: "Failed to create Krypt. Please try again.",
      });
    }
  };

  // Determine if user can proceed to next step
  const canProceedToStep2 =
    kryptData.title.trim() !== "" && kryptData.description.trim() !== "";
  const canProceedToStep3 = kryptData.content.length > 0;
  const canSubmitForm =
    kryptData.type === "no lock" ||
    (kryptData.type === "passcode" &&
      kryptData.questions.length === 1 &&
      kryptData.questions[0].answer) ||
    ((kryptData.type === "quiz" ||
      kryptData.type === KryptTypeEnum.MULTPLE_CHOICE) &&
      kryptData.questions.length > 0);

  const renderStepOne = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">
        Basic Information
      </h2>

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={kryptData.title}
          onChange={handleBasicInfoChange}
          className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
          placeholder="Enter krypt title"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={kryptData.description}
          onChange={handleBasicInfoChange}
          rows={4}
          className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
          placeholder="Enter krypt description"
        />
      </div>

      <div className="flex justify-between">
        <div></div>
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!canProceedToStep2}
          className={`flex items-center px-4 py-2 rounded-md ${
            canProceedToStep2
              ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">Content</h2>

      {/* Content type selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Content Type</label>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => handleContentTypeChange("text")}
            className={`flex items-center px-3 py-2 rounded-md ${
              currentContent.type === "text"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <IoText className="mr-2" />
            Text
          </button>
          <button
            type="button"
            onClick={() => handleContentTypeChange("image")}
            className={`flex items-center px-3 py-2 rounded-md ${
              currentContent.type === "image"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <FiImage className="mr-2" />
            Image
          </button>
          <button
            type="button"
            onClick={() => handleContentTypeChange("sound")}
            className={`flex items-center px-3 py-2 rounded-md ${
              currentContent.type === "sound"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <FiMusic className="mr-2" />
            Sound
          </button>
        </div>
      </div>

      {/* Content input based on type */}
      <div className="mb-6">
        {currentContent.type === "text" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Text Content
            </label>
            <textarea
              value={currentContent.content}
              onChange={(e) => handleContentValueChange(e.target.value)}
              rows={4}
              className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
              placeholder="Enter your text content"
            />
          </div>
        )}

        {currentContent.type === "image" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Image Source
            </label>
            <div className="flex space-x-3 mb-3">
              <button
                type="button"
                className="flex items-center px-3 py-2 bg-[#333339] rounded-md"
              >
                <FiUpload className="mr-2" />
                Upload
              </button>
              <button
                type="button"
                className="flex items-center px-3 py-2 bg-[#333339] rounded-md"
              >
                <FiImage className="mr-2" />
                Pexels
              </button>
            </div>
            <input
              type="text"
              value={currentContent.content}
              onChange={(e) => handleContentValueChange(e.target.value)}
              className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
              placeholder="Image URL"
            />
          </div>
        )}

        {currentContent.type === "sound" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Sound Source
            </label>
            <div className="flex space-x-3 mb-3">
              <button
                type="button"
                className="flex items-center px-3 py-2 bg-[#333339] rounded-md"
              >
                <FiYoutube className="mr-2" />
                Search YouTube Music
              </button>
            </div>
            <input
              type="text"
              value={currentContent.content}
              onChange={(e) => handleContentValueChange(e.target.value)}
              className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
              placeholder="YouTube Music URL"
            />
          </div>
        )}
      </div>

      {/* Add content button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={addContentItem}
          disabled={!currentContent.content.trim()}
          className={`flex items-center px-4 py-2 rounded-md ${
            currentContent.content.trim()
              ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <FiPlus className="mr-2" />
          Add Content Item
        </button>
      </div>

      {/* Content list */}
      {kryptData.content.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Added Content</h3>
          <div className="space-y-3">
            {kryptData.content.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-[#333339] rounded-md"
              >
                <div className="flex items-center">
                  {item.type === "text" && (
                    <IoText className="mr-2 text-[#B2F17E]" />
                  )}
                  {item.type === "image" && (
                    <FiImage className="mr-2 text-[#B2F17E]" />
                  )}
                  {item.type === "sound" && (
                    <FiMusic className="mr-2 text-[#B2F17E]" />
                  )}
                  <span className="truncate max-w-xs">{item.content}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeContentItem(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          disabled={!canProceedToStep3}
          className={`flex items-center px-4 py-2 rounded-md ${
            canProceedToStep3
              ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="transition-all">
      <h2 className="text-2xl font-bold mb-6 text-[#B2F17E]">Security</h2>

      {/* Lock type selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Lock Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.NO_LOCK)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === "no lock"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <FiLock className="mr-2" />
            No Lock
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.PASSCODE)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === "passcode"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <RiLockPasswordLine className="mr-2" />
            Passcode
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.QUIZ)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === "quiz"
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <RiQuestionAnswerLine className="mr-2" />
            Quiz
          </button>
          <button
            type="button"
            onClick={() => handleLockTypeChange(KryptTypeEnum.MULTPLE_CHOICE)}
            className={`flex items-center px-3 py-3 rounded-md ${
              kryptData.type === KryptTypeEnum.MULTPLE_CHOICE
                ? "bg-[#B2F17E] text-[#222227]"
                : "bg-[#333339] text-white"
            }`}
          >
            <MdOutlineQuiz className="mr-2" />
            Multiple Choice
          </button>
        </div>
      </div>

      {/* Question inputs based on lock type */}
      {kryptData.type !== "no lock" && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">
            {kryptData.type === "passcode" ? "Set Passcode" : "Add Question"}
          </h3>

          {kryptData.type === "passcode" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Passcode</label>
              <input
                type="text"
                name="answer"
                value={currentQuestion.answer}
                onChange={handleQuestionChange}
                className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                placeholder="Enter passcode"
              />
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                  placeholder="Enter your question"
                />
              </div>

              {kryptData.type === KryptTypeEnum.MULTPLE_CHOICE && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                          className="flex-1 bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                          placeholder={`Option ${index + 1}`}
                        />
                        {currentQuestion.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {currentQuestion.options.length < 3 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-2 text-[#B2F17E] hover:text-opacity-80 text-sm flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Option
                    </button>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Answer</label>
                <input
                  type="text"
                  name="answer"
                  value={currentQuestion.answer}
                  onChange={handleQuestionChange}
                  className="w-full bg-[#333339] border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#B2F17E]"
                  placeholder="Enter the correct answer"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={addQuestion}
            disabled={
              kryptData.type === "passcode"
                ? !currentQuestion.answer
                : !currentQuestion.question || !currentQuestion.answer
            }
            className={`flex items-center px-4 py-2 rounded-md ${
              (
                kryptData.type === "passcode"
                  ? currentQuestion.answer
                  : currentQuestion.question && currentQuestion.answer
              )
                ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiPlus className="mr-2" />
            {kryptData.type === "passcode" ? "Set Passcode" : "Add Question"}
          </button>
        </div>
      )}

      {/* Questions list */}
      {kryptData.questions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">
            {kryptData.type === "passcode" ? "Passcode Set" : "Added Questions"}
          </h3>
          <div className="space-y-3">
            {kryptData.questions.map((q, index) => (
              <div key={index} className="p-3 bg-[#333339] rounded-md">
                <div className="flex justify-between">
                  <div>
                    {kryptData.type !== "passcode" && (
                      <p className="font-medium mb-1">{q.question}</p>
                    )}
                    <p className="text-sm text-[#B2F17E]">Answer: {q.answer}</p>
                    {kryptData.type === KryptTypeEnum.MULTPLE_CHOICE &&
                      q.options.length > 0 && (
                        <div className="mt-1 text-sm text-gray-300">
                          <p>Options:</p>
                          <ul className="list-disc list-inside">
                            {q.options.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
        <div className="flex space-x-3">
          <button
            type="button"
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            <FiSave className="mr-2" />
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={!canSubmitForm}
            className={`flex items-center px-4 py-2 rounded-md ${
              canSubmitForm
                ? "bg-[#B2F17E] text-[#222227] hover:bg-opacity-90"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Create Krypt
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w- w-full mx-auto px-4 py-8 bg-[#222227] min-h-screen  text-white">
      {/* Progress indicators */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <div
          className={`flex flex-col items-center ${
            step >= 1 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 1 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            1
          </div>
          <span>Basic Info</span>
        </div>
        <div
          className={`h-1 flex-1 mx-2 ${
            step >= 2 ? "bg-[#B2F17E]" : "bg-gray-700"
          }`}
        ></div>
        <div
          className={`flex flex-col items-center ${
            step >= 2 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 2 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            2
          </div>
          <span>Content</span>
        </div>
        <div
          className={`h-1 flex-1 mx-2 ${
            step >= 3 ? "bg-[#B2F17E]" : "bg-gray-700"
          }`}
        ></div>
        <div
          className={`flex flex-col items-center ${
            step >= 3 ? "text-[#B2F17E]" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              step >= 3 ? "bg-[#B2F17E] text-[#222227]" : "bg-gray-700"
            }`}
          >
            3
          </div>
          <span>Security</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Information */}
        {step === 1 && renderStepOne()}

        {/* Step 2: Content */}
        {step === 2 && renderStepTwo()}

        {/* Step 3: Security/Lock */}
        {step === 3 && renderStepThree()}
      </form>
    </div>
  );
};

export default authUserWrapper(CreateKryptForm);
