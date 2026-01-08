/**
 * Quiz Mode - Decision Training with Instant Feedback
 * Now with 22 questions covering Preflop, Postflop, 3-bet, ICM, Odds, Position
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle, Brain, Zap, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";

type QuizDifficulty = 'easy' | 'medium' | 'hard';
type QuizCategory = 'preflop' | 'postflop' | '3bet' | 'icm' | 'odds' | 'position';

interface QuizQuestion {
  id: number;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  scenario: string;
  position: string;
  stackBB: number;
  action: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  concept: string;
  readTime: number;
}

export default function QuizMode() {
  const [, navigate] = useLocation();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<QuizDifficulty | 'all'>('all');
  const [category, setCategory] = useState<QuizCategory | 'all'>('all');
  const [quizStarted, setQuizStarted] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Fetch quiz data
  const { data: allQuestions, isLoading } = trpc.quiz.getAllQuestions.useQuery();
  const { data: stats } = trpc.quiz.getStats.useQuery();

  // Load questions based on filters
  useEffect(() => {
    if (!allQuestions) return;

    let filtered = allQuestions;

    // Filter by difficulty
    if (difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(q => q.category === category);
    }

    // Shuffle
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  }, [allQuestions, difficulty, category]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="md:ml-64 pt-16">
          {/* Header with Illustration */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-block text-xs font-mono px-2 py-1 rounded mb-3 bg-red-100 text-red-700">
                    GTO + Exploitative Play
                  </span>
                  <h1 className="text-4xl font-bold mb-4">Decision Training</h1>
                  <p className="text-xl text-gray-600">
                    Master poker strategy with {stats?.totalQuestions || 22} scenarios covering preflop, postflop, ICM, and more.
                  </p>
                </div>
                <div className="hidden md:block flex-shrink-0 w-32 h-32 lg:w-40 lg:h-40">
                  <img 
                    src="/illustrations/selfie.svg" 
                    alt="Training illustration"
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">{stats?.totalQuestions}</div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats?.byDifficulty?.easy}</div>
                    <div className="text-sm text-gray-600">Easy</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{stats?.byDifficulty?.medium}</div>
                    <div className="text-sm text-gray-600">Medium</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{stats?.byDifficulty?.hard}</div>
                    <div className="text-sm text-gray-600">Hard</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Questions by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(stats?.byCategory || {}).map(([cat, count]) => (
                    <div key={cat} className="p-3 bg-gray-50 rounded">
                      <div className="font-semibold capitalize">{cat}</div>
                      <div className="text-2xl font-bold text-emerald-600">{count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Difficulty</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['all', 'easy', 'medium', 'hard'] as const).map(diff => (
                  <Button
                    key={diff}
                    variant={difficulty === diff ? 'default' : 'outline'}
                    onClick={() => setDifficulty(diff)}
                    className={difficulty === diff ? 'bg-emerald-600' : ''}
                  >
                    {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['all', 'preflop', 'postflop', '3bet', 'icm', 'odds', 'position'] as const).map(cat => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'outline'}
                    onClick={() => setCategory(cat)}
                    className={category === cat ? 'bg-emerald-600' : ''}
                  >
                    {cat === 'all' ? 'All' : cat === '3bet' ? '3-Bet' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={() => setQuizStarted(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg"
              disabled={questions.length === 0}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Training ({questions.length} questions)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">No questions found for this filter.</p>
          <Button onClick={() => setQuizStarted(false)} className="mt-4">
            Back to Selection
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isComplete = currentIndex >= questions.length;

  if (isComplete) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <Trophy className="w-24 h-24 mx-auto text-emerald-600" />
          
          <div>
            <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-gray-600">Great effort! Here's your performance breakdown.</p>
          </div>

          <Card className="border-2 border-emerald-600">
            <CardContent className="pt-8 space-y-6">
              <div>
                <div className="text-6xl font-bold text-emerald-600">{accuracy}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded">
                  <div className="text-3xl font-bold text-emerald-600">{score}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="p-4 bg-red-50 rounded">
                  <div className="text-3xl font-bold text-red-600">{questions.length - score}</div>
                  <div className="text-sm text-gray-600">Incorrect</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">Total Time</div>
                <div className="text-2xl font-semibold">{Math.round(questions.length * 2)} min</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={() => setQuizStarted(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
            >
              Try Another Quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/tools')}
              className="w-full"
            >
              Back to Tools
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setQuizStarted(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm font-mono text-gray-600">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>

          <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-2">
                  {currentQuestion.category.toUpperCase()} • {currentQuestion.difficulty.toUpperCase()}
                </div>
                <CardTitle className="text-2xl mt-2">{currentQuestion.concept}</CardTitle>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Read time</div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <Clock className="w-4 h-4" />
                  {currentQuestion.readTime}s
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Scenario */}
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-600">
              <div className="text-sm text-gray-600 mb-2">Scenario</div>
              <p className="text-lg">{currentQuestion.scenario}</p>
              <div className="mt-3 text-sm text-gray-600">
                Position: <span className="font-semibold">{currentQuestion.position}</span> | Stack: <span className="font-semibold">{currentQuestion.stackBB}BB</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!answered) {
                      setSelectedAnswer(idx);
                      setAnswered(true);
                      if (option.isCorrect) {
                        setScore(score + 1);
                      }
                    }
                  }}
                  disabled={answered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === idx
                      ? option.isCorrect
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {selectedAnswer === idx ? (
                        option.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{option.text}</div>
                      {selectedAnswer === idx && (
                        <div className="text-sm text-gray-700 mt-2">{option.explanation}</div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            {answered && (
              <Button
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                  setSelectedAnswer(null);
                  setAnswered(false);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
              >
                {currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <Brain className="w-5 h-5 mx-auto text-emerald-600 mb-2" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <BarChart3 className="w-5 h-5 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{Math.round((score / (currentIndex + 1)) * 100)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto text-orange-600 mb-2" />
                <div className="text-2xl font-bold">{currentIndex + 1}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
