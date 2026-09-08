import React, { useState } from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { api } from '../../services/api.js';
import { DistrictAirQualitySummary } from '../../types/index.js';
import { useLanguage } from '../../context/LanguageContext.js';

interface AeroPulseAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DistrictAirQualitySummary | null;
  selectedDate: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  disclaimer?: string;
}

export const AeroPulseAiModal: React.FC<AeroPulseAiModalProps> = ({
  isOpen,
  onClose,
  summary,
  selectedDate
}) => {
  const { language, t } = useLanguage();
  const tai = t.ai;

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'assistant',
      text: summary?.district
        ? `${tai.welcomeMessage} (${summary.district}, ${selectedDate})`
        : tai.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: tai.welcomeDisclaimer
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    tai.quickQuestions.q1,
    tai.quickQuestions.q2,
    tai.quickQuestions.q3,
    tai.quickQuestions.q4,
    tai.quickQuestions.q5,
    tai.quickQuestions.q6,
  ];

  const handleSendMessage = async (queryText: string) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build dynamic context payload including language
      const context = {
        state: summary?.state || '',
        district: summary?.district || '',
        station: summary?.stations?.[0]?.name,
        selectedDate,
        aqi: summary?.aqiResult?.aqi,
        category: summary?.aqiResult?.category,
        dominantPollutant: summary?.aqiResult?.dominantPollutant,
        pollutants: summary?.pollutants,
        hasData: summary?.hasData ?? false,
        dataSource: summary?.dataSource?.name,
        timestamp: summary?.lastUpdated,
        language
      };

      const res = await api.askAi(textToSend, context);

      const aiMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: res.disclaimer
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        text: tai.errorConnecting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: tai.errorDisclaimer
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 id="ai-modal-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🌬️ {tai.title}</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tai.subtitle} &bull; {summary?.district}, {summary?.state} ({selectedDate})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tai.closeModal}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                {m.disclaimer && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {m.disclaimer}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300" />
              <span>{tai.analyzingTelemetry}</span>
            </div>
          )}
        </div>

        {/* Quick Questions Pills */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{tai.quickQuestionsTitle}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 transition-all shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={tai.inputPlaceholder}
            disabled={isLoading}
            className="flex-1 min-h-[44px] px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label={tai.sendMessage}
            className="min-h-[44px] min-w-[44px] rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
