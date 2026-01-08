/**
 * Quiz Mode - Decision Training with Instant Feedback
 * Inspired by Poker Trainer and GTO Wizard Battle+
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle, Brain, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface QuizQuestion {
  id: number;
  scenario: string;
  hand: string;
  position: string;
  villainAction: string;
  potSize: number;
  betSize: number;
  options: { action: string; isCorrect: boolean; explanation: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  concept: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: "UTG opens 2.5BB, folds to you in BB",
    hand: "A♠5♠",
    position: "BB",
    villainAction: "UTG Open 2.5BB",
    potSize: 3.5,
    betSize: 2.5,
    options: [
      { action: "FOLD", isCorrect: false, explanation: "A5s has enough equity and playability to defend. Folding is too tight." },
      { action: "CALL", isCorrect: true, explanation: "Correct! A5s is a standard defend from BB vs UTG open. Good equity with nut potential." },
      { action: "3-BET to 9BB", isCorrect: false, explanation: "A5s can be a 3-bet bluff sometimes, but calling is higher EV vs tight UTG range." }
    ],
    difficulty: 'easy',
    concept: "Preflop Defense"
  },
  {
    id: 2,
    scenario: "You open BTN 2.5BB, BB 3-bets to 9BB",
    hand: "K♠Q♠",
    position: "BTN",
    villainAction: "BB 3-bet 9BB",
    potSize: 11.5,
    betSize: 6.5,
    options: [
      { action: "FOLD", isCorrect: false, explanation: "KQs is too strong to fold vs BB 3-bet. You have position and good equity." },
      { action: "CALL", isCorrect: true, explanation: "Correct! KQs is a standard call in position. You have good playability postflop." },
      { action: "4-BET to 22BB", isCorrect: false, explanation: "KQs is not strong enough to 4-bet for value. Calling keeps their bluffs in." }
    ],
    difficulty: 'medium',
    concept: "3-Bet Pots"
  },
  {
    id: 3,
    scenario: "Flop: K♥7♦2♣. You c-bet 1/3 pot, villain raises 3x",
    hand: "A♠A♥",
    position: "IP",
    villainAction: "Check-raise 3x",
    potSize: 24,
    betSize: 12,
    options: [
      { action: "FOLD", isCorrect: false, explanation: "AA is way too strong to fold on this dry board. Villain has many bluffs." },
      { action: "CALL", isCorrect: true, explanation: "Correct! Call and re-evaluate turn. AA beats most of villain's value range." },
      { action: "RE-RAISE All-in", isCorrect: false, explanation: "Shoving folds out bluffs and only gets called by sets/two pair. Calling is better." }
    ],
    difficulty: 'medium',
    concept: "Facing Aggression"
  },
  {
    id: 4,
    scenario: "River: K♥7♦2♣4♠9♥. Pot is 45BB. Villain bets 35BB",
    hand: "K♠Q♠",
    position: "IP",
    villainAction: "River overbet 78% pot",
    potSize: 80,
    betSize: 35,
    options: [
      { action: "FOLD", isCorrect: false, explanation: "Top pair good kicker is too strong to fold. Villain can have missed draws." },
      { action: "CALL", isCorrect: true, explanation: "Correct! KQ is a mandatory call. You beat KJ, KT, and all bluffs." },
      { action: "RAISE to 90BB", isCorrect: false, explanation: "Raising turns your hand into a bluff. KQ is a pure call on this runout." }
    ],
    difficulty: 'hard',
    concept: "River Decisions"
  },
  {
    id: 5,
    scenario: "Tournament, 15BB effective. Folds to you in SB",
    hand: "T♠8♠",
    position: "SB",
    villainAction: "BB waiting",
    potSize: 1.5,
    betSize: 0,
    options: [
      { action: "FOLD", isCorrect: false, explanation: "T8s has too much equity to fold at 15BB. You're leaving money on the table." },
      { action: "LIMP", isCorrect: false, explanation: "Limping is exploitable and gives BB a free look. Push or fold is correct." },
      { action: "PUSH All-in", isCorrect: true, explanation: "Correct! At 15BB, T8s is a standard push from SB. High fold equity + equity when called." }
    ],
    difficulty: 'medium',
    concept: "Push/Fold"
  },
  {
    id: 6,
    scenario: "You have 8BB in CO. UTG (50BB) opens 2.5BB",
    hand: "A♠J♥",
    position: "CO",
    villainAction: "UTG Open 2.5BB",
    potSize: 4,
    betSize: 2.5,
    options: [
      { action: "FOLD", isCorrect: false, explanation: "AJo is too strong to fold with 8BB. You need to accumulate chips." },
      { action: "CALL", isCorrect: false, explanation: "Calling commits 30% of your stack with no fold equity. Shoving is better." },
      { action: "PUSH All-in", isCorrect: true, explanation: "Correct! AJo is a premium shove over UTG open at 8BB. Good equity vs calling range." }
    ],
    difficulty: 'hard',
    concept: "Short Stack Play"
  }
];

export default function QuizMode() {
  const [, navigate] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);

  const question = QUIZ_QUESTIONS[currentQuestion];

  useEffect(() => {
    if (timerActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1); // Time's up
    }
  }, [timeLeft, timerActive, showResult]);

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
    setTimerActive(false);

    if (optionIndex >= 0 && question.options[optionIndex].isCorrect) {
      setScore(score + (timeLeft > 20 ? 100 : timeLeft > 10 ? 75 : 50));
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setQuizComplete(false);
    setTimeLeft(30);
    setTimerActive(true);
  };

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-5xl font-bold text-blue-600">{score}</div>
            <p className="text-gray-600">points earned</p>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {QUIZ_QUESTIONS.filter((_, i) => i <= currentQuestion).length}
                </div>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(score / QUIZ_QUESTIONS.length)}
                </div>
                <p className="text-sm text-gray-600">Avg Score</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={restartQuiz} className="flex-1">
                Play Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/tools")} className="flex-1">
                Back to Tools
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <Button variant="ghost" onClick={() => navigate("/tools")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Decision Training</h1>
              <p className="text-gray-600">Test your poker decision-making skills</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{score}</div>
                <p className="text-xs text-gray-500">Score</p>
              </div>
              {streak > 1 && (
                <div className="flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-orange-600">{streak}x</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container py-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <div className="flex-1">
            <Progress value={(currentQuestion / QUIZ_QUESTIONS.length) * 100} />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="container pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Timer */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{timeLeft}s</span>
            </div>
          </div>

          {/* Scenario Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {question.difficulty.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">{question.concept}</span>
              </div>
              <CardTitle className="text-xl mt-2">{question.scenario}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Your Hand</p>
                  <p className="text-xl font-bold">{question.hand}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-xl font-bold">{question.position}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Pot Size</p>
                  <p className="text-xl font-bold">{question.potSize} BB</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">To Call</p>
                  <p className="text-xl font-bold">{question.betSize} BB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  showResult
                    ? option.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : selectedAnswer === index
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.action}</span>
                  {showResult && (
                    option.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : null
                  )}
                </div>
                {showResult && (
                  <p className={`mt-2 text-sm ${option.isCorrect ? 'text-green-700' : 'text-gray-600'}`}>
                    {option.explanation}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Next Button */}
          {showResult && (
            <div className="mt-6 text-center">
              <Button onClick={nextQuestion} size="lg">
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
