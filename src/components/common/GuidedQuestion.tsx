import { MessageCircleQuestion } from 'lucide-react';

/**
 * A styled prompt that asks the student a guiding question.
 * Used in the "Verify" step to direct exploration of the simulator.
 */
export function GuidedQuestion({ question }: { question: string }) {
  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-5 border border-purple-200">
      <div className="flex items-start gap-3">
        <MessageCircleQuestion className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-purple-900 leading-relaxed font-medium">{question}</p>
      </div>
    </div>
  );
}
