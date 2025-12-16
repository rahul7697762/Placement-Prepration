import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIRephraseButtonProps {
  text: string;
  section: string;
  onApply: (newText: string) => void;
}

// API Keys
const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const geminiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

// Request limit configuration
const MAX_REPHRASE_REQUESTS = 5;
const STORAGE_KEY = 'ai_rephrase_usage_count';

// Helper functions for localStorage
const getUsageCount = (): number => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const setUsageCount = (count: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, count.toString());
};

const AIRephraseButton: React.FC<AIRephraseButtonProps> = ({ text, section, onApply }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageCount, setUsageCountState] = useState(0);
  const [remainingRequests, setRemainingRequests] = useState(MAX_REPHRASE_REQUESTS);

  // Load usage count on mount
  useEffect(() => {
    const count = getUsageCount();
    setUsageCountState(count);
    setRemainingRequests(Math.max(0, MAX_REPHRASE_REQUESTS - count));
  }, []);

  // Check if user has reached the limit
  const hasReachedLimit = remainingRequests <= 0;

  // Call OpenAI
  const callOpenAI = async (prompt: string): Promise<string> => {
    if (!openaiKey) throw new Error('OpenAI API key not configured');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  // Call Gemini
  const callGemini = async (prompt: string): Promise<string> => {
    if (!geminiKey) throw new Error('Gemini API key not configured');

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  };

  const generateSuggestions = async () => {
    // Check limit first
    if (hasReachedLimit) {
      setError('You have used all 5 AI Rephrase requests. Limit reached.');
      return;
    }

    if (!text || text.trim().length < 10) {
      setError('Please enter at least 10 characters to get AI suggestions');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    const prompt = `
You are a senior resume optimization expert specializing in ATS (Applicant Tracking Systems).

Objective:
Rewrite the following **${section}** section to maximize ATS compatibility and recruiter impact.

ATS Optimization Rules:
- Use standard resume terminology commonly recognized by ATS
- Prioritize role-specific keywords and skills (without keyword stuffing)
- Start bullet points with strong action verbs
- Use clear, simple sentence structures
- Quantify results where logically possible (do not fabricate data)
- Avoid graphics, symbols, emojis, or complex formatting
- Use consistent tense (past for previous roles, present for current roles)

Original Text:
"${text}"

Output Instructions:
- Provide **3 distinct ATS-optimized variations**
- Each version must be concise, professional, and keyword-rich
- Output as plain text
- Number each version clearly (1–3)
`;


    try {
      let generatedText = '';

      // Try OpenAI first
      if (openaiKey) {
        try {
          console.log('Attempting OpenAI for AI Rephrase...');
          generatedText = await callOpenAI(prompt);
          console.log('OpenAI succeeded for AI Rephrase');
        } catch (err) {
          console.warn('OpenAI failed, falling back to Gemini:', err);
        }
      }

      // Fallback to Gemini
      if (!generatedText && geminiKey) {
        try {
          console.log('Attempting Gemini for AI Rephrase...');
          generatedText = await callGemini(prompt);
          console.log('Gemini succeeded for AI Rephrase');
        } catch (err) {
          console.error('Gemini also failed:', err);
          throw err;
        }
      }

      if (!generatedText) {
        throw new Error('No AI service available. Please configure NEXT_PUBLIC_OPENAI_API_KEY or NEXT_PUBLIC_GOOGLE_AI_API_KEY');
      }

      console.log('Generated text:', generatedText);

      // Parse the numbered suggestions
      const lines = generatedText.split('\n').filter((line: string) => line.trim());
      const parsedSuggestions = lines
        .filter((line: string) => /^\d+[.)]/.test(line.trim()))
        .map((line: string) => line.replace(/^\d+[.)]/, '').trim())
        .filter((s: string) => s.length > 0);

      if (parsedSuggestions.length === 0) {
        // Fallback: split by newlines if no numbered format
        const fallbackSuggestions = lines.slice(0, 3).filter((s: string) => s.length > 10);
        setSuggestions(fallbackSuggestions.length > 0 ? fallbackSuggestions : [generatedText.trim()]);
      } else {
        setSuggestions(parsedSuggestions.slice(0, 3));
      }

      // Increment usage count after successful generation
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      setUsageCountState(newCount);
      setRemainingRequests(Math.max(0, MAX_REPHRASE_REQUESTS - newCount));

      setShowSuggestions(true);
    } catch (err) {
      console.error('AI Rephrase Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(`${errorMessage}. Please check your API keys in .env.local`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (suggestion: string) => {
    onApply(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={generateSuggestions}
        disabled={isLoading || !text || hasReachedLimit}
        className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${hasReachedLimit
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        title={hasReachedLimit ? 'AI Rephrase limit reached (5/5 used)' : `${remainingRequests} requests remaining`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>AI Rephrase</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${hasReachedLimit
              ? 'bg-red-500/30 text-red-200'
              : 'bg-white/20'
              }`}>
              {remainingRequests}/{MAX_REPHRASE_REQUESTS}
            </span>
          </>
        )}
      </button>

      {error && (
        <div className="absolute z-10 mt-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg shadow-lg text-sm text-red-600 dark:text-red-400 w-80">
          {error}
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-xl w-96 max-h-96 flex flex-col">
          {/* Fixed Header */}
          <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-200 dark:border-slate-600 flex-shrink-0">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">AI Suggestions</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {remainingRequests} request{remainingRequests !== 1 ? 's' : ''} remaining
              </p>
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <div className="space-y-3 p-4 pt-3 pr-5">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-purple-50 dark:bg-slate-700 rounded-lg border border-purple-200 dark:border-slate-600"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {suggestion}
                  </p>
                  <button
                    onClick={() => handleApply(suggestion)}
                    className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Use This
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRephraseButton;

