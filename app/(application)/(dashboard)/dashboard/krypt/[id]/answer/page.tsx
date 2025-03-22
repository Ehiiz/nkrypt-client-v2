/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useKryptQuestions } from "@/app/_hooks/user/krypt/useKryptQuestions";
import { KryptTypeEnum } from "@/app/_hooks/user/krypt/krypt.interface";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";

const KryptAnswerPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { questionData, questionLoading, error } = useKryptQuestions({
    id: id,
  });
  const [answers, setAnswers] = useState<string[]>([]);
  const [passcodeValue, setPasscodeValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle loading and error states
  if (questionLoading) return <div className="p-4">Loading questions...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error loading questions: {error.message}
      </div>
    );
  if (!questionData) return <div className="p-4">No questions found</div>;

  const { questions, type } = questionData;

  // Update answer for a specific question index
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let submittedAnswers: string[] = [];

    if (type === KryptTypeEnum.PASSCODE) {
      // Only add passcode if it's not empty
      if (passcodeValue.trim() !== "") {
        submittedAnswers.push(passcodeValue);
      }
    } else if (type === KryptTypeEnum.NO_LOCK) {
      submittedAnswers = [];
    } else {
      // Filter out any null, undefined, or empty strings from answers
      submittedAnswers = answers.filter(
        (answer) =>
          answer !== null && answer !== undefined && answer.trim() !== ""
      );
    }

    try {
      const data = await UserKryptService.unlockKrypt({
        answers: submittedAnswers,
        id,
      });

      if (data.success) {
        if (data.data?.success) {
          toastAlert({
            type: ToastType.success,
            message: "Krypt unlocked successfully!",
          });

          router.replace(`/dashboard/krypt/${id}/unlock`);
        } else {
          toastAlert({
            type: ToastType.error,
            message: data.data?.message,
          });
        }
      }
    } catch (error) {
      toastAlert({
        type: ToastType.error,
        message: "Error while unlocking",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Render different input types based on Krypt type
  const renderQuestionInputs = () => {
    switch (type) {
      case KryptTypeEnum.NO_LOCK:
        return (
          <div className="text-center py-6">
            <p className="mb-4">
              This Krypt has no lock. Click the button to unlock.
            </p>
          </div>
        );

      case KryptTypeEnum.PASSCODE:
        return (
          <div className="py-4">
            <label className="block mb-2 font-medium">Enter Passcode</label>
            <input
              type="password"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              value={passcodeValue}
              onChange={(e) => setPasscodeValue(e.target.value)}
              placeholder="Enter passcode"
            />
          </div>
        );

      case KryptTypeEnum.QUIZ:
        return questions.map((question) => (
          <div key={question._id} className="mb-6">
            <label className="block mb-2 font-medium">
              Question {question.index + 1}: {question.question}
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              value={answers[question.index] || ""}
              onChange={(e) =>
                handleAnswerChange(question.index, e.target.value)
              }
              placeholder="Your answer"
            />
          </div>
        ));

      case KryptTypeEnum.MULTPLE_CHOICE:
        return questions.map((question) => (
          <div key={question._id} className="mb-6">
            <label className="block mb-2 font-medium">
              Question {question.index + 1}: {question.question}
            </label>
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${question.index}-option${optionIndex}`}
                    name={`question-${question.index}`}
                    className="mr-2"
                    checked={answers[question.index] === option}
                    onChange={() => handleAnswerChange(question.index, option)}
                  />
                  <label htmlFor={`q${question.index}-option${optionIndex}`}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ));

      default:
        return <div>Unsupported Krypt type</div>;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        {type === KryptTypeEnum.NO_LOCK
          ? "Unlock Krypt"
          : type === KryptTypeEnum.PASSCODE
          ? "Enter Passcode"
          : "Answer Questions"}
      </h2>

      <form onSubmit={handleSubmit}>
        {renderQuestionInputs()}

        <button
          type="submit"
          className="w-full bg-[#B2F17E] hover:bg-[#B2F17E0]/[50] text-black font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : type === KryptTypeEnum.NO_LOCK
            ? "Unlock"
            : "Submit Answers"}
        </button>
      </form>
    </div>
  );
};

export default KryptAnswerPage;
