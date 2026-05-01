import React from 'react';

type Status = 'idle' | 'searching' | 'reading' | 'generating';

interface StatusBreadcrumbProps {
  status: Status;
}

export default function StatusBreadcrumb({ status }: StatusBreadcrumbProps) {
  const steps = [
    { id: 'searching', label: 'Searching Knowledge' },
    { id: 'reading', label: 'Analyzing Sources' },
    { id: 'generating', label: 'Synthesizing Answer' }
  ];

  if (status === 'idle') return null;

  return (
    <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mb-6 animate-fade-in px-2">
      {steps.map((step, index) => {
        const isActive = status === step.id;
        const isPast = steps.findIndex(s => s.id === status) > index;
        
        return (
          <React.Fragment key={step.id}>
            <span className={`transition-all duration-300 ${isActive ? "text-sky-400" : isPast ? "text-slate-300" : "opacity-30"}`}>
              {step.label}
              {isActive && <span className="ml-1 animate-pulse">...</span>}
            </span>
            {index < steps.length - 1 && <span className="opacity-10">/</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}