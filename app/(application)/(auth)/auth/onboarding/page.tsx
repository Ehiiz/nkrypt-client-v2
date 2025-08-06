"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Gift,
  Rocket,
  ArrowLeft,
  ArrowRight,
  Heart,
  Puzzle,
} from "lucide-react"; // Importing relevant icons from lucide-react
import { useRouter } from "next/navigation";

function OnboardingScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: (
        <>
          NKRYPT: Where Stories Get Unlocked.
          <br className="hidden sm:inline" /> Share, Puzzle, & Play!
        </>
      ),
      description:
        "Imagine a place where your content comes alive with puzzles and rewards. NKRYPT lets you share your unique stories, connect with friends, and even send secret messages, all powered by the Cardano blockchain.",
      features: [], // No specific features listed on the intro slide
    },
    {
      title: "For Creators: Build Genuine Engagement",
      description:
        "Go beyond likes! Create 'Krypts' that challenge and delight your audience. Reward true engagement with ADA, fostering a community that truly connects with your content.",
      features: [
        {
          icon: Sparkles,
          name: "Craft Your Krypts",
          description:
            "Share multimedia stories, art, and thoughts with flair.",
          gradient: "from-purple-600 to-pink-600",
          hoverBorder: "hover:border-purple-500/70",
        },
        {
          icon: Puzzle, // Changed icon to Puzzle for playful challenge
          name: "Lock with a Twist",
          description:
            "Hide content behind fun quizzes, passcodes, or choices.",
          gradient: "from-blue-600 to-cyan-600",
          hoverBorder: "hover:border-blue-500/70",
        },
      ],
    },
    {
      title: "For Friends & Lovers: Unlock the Fun!",
      description:
        "Discover exciting Krypts on your timeline. Solve the puzzles to 'Dekrypt' hidden content and share in the ADA rewards. Plus, send private, locked messages to that special someone!",
      features: [
        {
          icon: Gift,
          name: "Dekrypt & Discover",
          description:
            "Solve challenges to reveal content and earn ADA rewards.",
          gradient: "from-emerald-500 to-green-600",
          hoverBorder: "hover:border-emerald-500/70",
        },
        {
          icon: Heart, // New icon for romantic/personal touch
          name: "Private Krypts for Two",
          description:
            "Send secret messages unlocked only by your partner's name.",
          gradient: "from-red-500 to-rose-600",
          hoverBorder: "hover:border-red-500/70",
        },
      ],
    },
    {
      title: "Ready to Join the NKRYPT Party?",
      description:
        "Whether you're a storyteller, a puzzle-solver, or just looking for a new way to connect, NKRYPT is your playground. Let's make content fun again!",
      features: [], // No specific features listed on the final CTA slide
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const handleBack = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    setCurrentSlide(slides.length - 1); // Go directly to the last slide
  };

  const isLastSlide = currentSlide === slides.length - 1;
  const isFirstSlide = currentSlide === 0;

  const currentSlideContent = slides[currentSlide];

  return (
    // Main container with the same background gradient as the Dashboard
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Animated background elements - replicating the Dashboard's visual flair */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/3 to-pink-400/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 bg-slate-800/60 backdrop-blur-lg border border-slate-700/50 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-3xl w-full text-center transform transition-all duration-500 ease-out scale-95 opacity-0 animate-fade-in-up">
        {/* NKRYPT Logo/Title */}
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-4xl sm:text-5xl mb-4">
          NKRYPT
        </div>

        {/* Slide Content */}
        <div className="min-h-[250px] flex flex-col justify-center items-center animate-slide-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-6 leading-tight">
            {currentSlideContent.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            {currentSlideContent.description}
          </p>

          {currentSlideContent.features.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 w-full">
              {currentSlideContent.features.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-slate-700/40 border border-slate-600/50 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${feature.hoverBorder}`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mb-3 shadow-md`}
                  >
                    <feature.icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`block w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                currentSlide === index
                  ? "bg-purple-500 scale-125"
                  : "bg-slate-600 hover:bg-slate-500"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isFirstSlide && (
            <button
              onClick={handleBack}
              className="group relative overflow-hidden bg-slate-700/60 hover:bg-slate-600/60 border border-slate-500/30 hover:border-blue-400/50 text-slate-300 hover:text-white font-medium py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/15"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2 justify-center">
                <ArrowLeft size={18} />
                <span>Back</span>
              </div>
            </button>
          )}

          {!isLastSlide ? (
            <>
              <button
                onClick={handleNext}
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2 justify-center">
                  <ArrowRight size={18} />
                  <span>Next</span>
                </div>
              </button>
              <button
                onClick={handleSkip}
                className="group relative overflow-hidden bg-slate-700/60 hover:bg-slate-600/60 border border-slate-500/30 hover:border-gray-400/50 text-slate-300 hover:text-white font-medium py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/15"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2 justify-center">
                  <span>Skip</span>
                </div>
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/signup")}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-2 justify-center">
                <Rocket size={18} />
                <span>Sign Up</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Tailwind CSS keyframes for custom animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in-right 0.6s ease-out forwards;
        }
        /* You might want to dynamically apply slide-in-left for back navigation */
      `}</style>
    </div>
  );
}

export default OnboardingScreen;
