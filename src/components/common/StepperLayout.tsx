import { useState, type ReactNode } from 'react';

export interface StepConfig {
  label: string;
  title: string;
  content: ReactNode;
  /** If provided, the Continue button is disabled until this returns true. */
  isGateSatisfied?: () => boolean;
}

/**
 * A 4-step progression layout.
 * Each step is revealed one at a time; the student advances by clicking Continue.
 * An optional gate function per step can block advancement until the student
 * has interacted (e.g. moved a slider).
 */
export function StepperLayout({ steps }: { steps: StepConfig[] }) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const isLocked = idx > currentStep;

          return (
            <button
              key={idx}
              onClick={() => { if (!isLocked) setCurrentStep(idx); }}
              disabled={isLocked}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-engineering-blue-600 text-white shadow-md'
                  : isCompleted
                    ? 'bg-engineering-blue-100 text-engineering-blue-700 hover:bg-engineering-blue-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                isActive ? 'bg-white text-engineering-blue-700' :
                isCompleted ? 'bg-engineering-blue-600 text-white' :
                'bg-slate-300 text-white'
              }`}>
                {isCompleted ? '\u2713' : idx + 1}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step title */}
      <h3 className="text-2xl font-semibold text-slate-900">
        Step {currentStep + 1}: {steps[currentStep].title}
      </h3>

      {/* Step content */}
      <div>{steps[currentStep].content}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
            currentStep === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          Back
        </button>

        {currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={steps[currentStep].isGateSatisfied ? !steps[currentStep].isGateSatisfied() : false}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              steps[currentStep].isGateSatisfied && !steps[currentStep].isGateSatisfied()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-engineering-blue-600 text-white hover:bg-engineering-blue-700 shadow-sm'
            }`}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
