/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/app/_utils/context/userContext";
import { useKryptQuestions } from "@/app/_hooks/user/krypt/useKryptQuestions";
import { HelpCircle, Loader2, Lock, Unlock, Zap } from "lucide-react";
import { KryptTypeEnum } from "@/app/_hooks/user/krypt/krypt.interface";
import { toastAlert, ToastType } from "@/app/_utils/notifications/toast";
import { UserKryptService } from "@/app/_hooks/user/krypt/krypt.hook";
import SubHeader from "@/app/_components/headers/subHeader";

const KryptAnswerPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user } = useUserContext();

  const { questionData, questionLoading, error } = useKryptQuestions({
    id: id,
  });
  const [answers, setAnswers] = useState<string[]>([]);
  const [passcodeValue, setPasscodeValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is logged in
  if (!user) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="fixed inset-0 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm z-50">
          <div className="text-center p-8 bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-xl max-w-sm w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 mx-auto">
              <Lock size={36} className="text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-300 mb-2">
              Authentication Required
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              You must be logged in to answer this krypt.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative z-10">Log In to Continue</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle loading and error states
  if (questionLoading) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl max-w-md w-full">
          <p className="text-xl font-semibold text-red-500 mb-4">Error</p>
          <p className="text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }
  if (!questionData) {
    return (
      <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl max-w-md w-full">
          <p className="text-xl font-semibold text-slate-300 mb-4">
            No questions found
          </p>
          <p className="text-slate-400">
            It seems this krypt is not set up correctly.
          </p>
        </div>
      </div>
    );
  }

  const { questions, type } = questionData;

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let submittedAnswers: string[] = [];

    if (type === KryptTypeEnum.PASSCODE) {
      if (passcodeValue.trim() !== "") {
        submittedAnswers.push(passcodeValue);
      }
    } else if (type === KryptTypeEnum.NO_LOCK) {
      submittedAnswers = [];
    } else {
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
            message: data.data?.message || "Incorrect answers.",
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

  const renderQuestionInputs = () => {
    switch (type) {
      case KryptTypeEnum.NO_LOCK:
        return (
          <div className="text-center py-6">
            <p className="mb-4 text-slate-300">
              This Krypt has no lock. Click the button to unlock.
            </p>
          </div>
        );

      case KryptTypeEnum.PASSCODE:
        return (
          <div className="py-4">
            <label className="block mb-2 font-medium text-slate-300">
              Enter Passcode
            </label>
            <input
              type="password"
              className="w-full p-3 bg-slate-700/60 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={passcodeValue}
              onChange={(e) => setPasscodeValue(e.target.value)}
              placeholder="Enter passcode"
            />
          </div>
        );

      case KryptTypeEnum.QUIZ:
        return questions.map((question) => (
          <div key={question.index} className="mb-6">
            <label className="block mb-2 font-medium text-slate-300">
              Question {question.index + 1}: {question.question}
            </label>
            <input
              type="text"
              className="w-full p-3 bg-slate-700/60 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
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
          <div key={question.index} className="mb-6">
            <label className="block mb-2 font-medium text-slate-300">
              Question {question.index + 1}: {question.question}
            </label>
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="radio"
                    id={`q${question.index}-option${optionIndex}`}
                    name={`question-${question.index}`}
                    className="mr-2 text-purple-500 bg-slate-700 border-slate-600"
                    checked={answers[question.index] === option}
                    onChange={() => handleAnswerChange(question.index, option)}
                  />
                  <label
                    htmlFor={`q${question.index}-option${optionIndex}`}
                    className="text-slate-300 cursor-pointer"
                  >
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <SubHeader />
      <div className="relative z-10 max-w-xl mx-auto p-4 sm:p-6">
        <div className="mt-8 p-6 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              {type === KryptTypeEnum.PASSCODE ? (
                <Lock size={24} className="text-white" />
              ) : type === KryptTypeEnum.NO_LOCK ? (
                <Unlock size={24} className="text-white" />
              ) : (
                <HelpCircle size={24} className="text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {type === KryptTypeEnum.NO_LOCK
                ? "Unlock Krypt"
                : type === KryptTypeEnum.PASSCODE
                ? "Enter Passcode"
                : "Answer Questions"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {renderQuestionInputs()}

            <button
              type="submit"
              className={`w-full min-h-[46px] rounded-lg text-white font-semibold flex items-center justify-center gap-2 mt-6
                ${
                  isSubmitting
                    ? "bg-purple-600/60 cursor-wait"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25"
                }
                transition-all duration-300 transform hover:scale-105
              `}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Submitting...
                </>
              ) : type === KryptTypeEnum.NO_LOCK ? (
                <>
                  <Unlock size={18} /> Unlock
                </>
              ) : (
                <>
                  <Zap size={18} /> Submit Answers
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KryptAnswerPage;
