'use client';

import React, { useState } from 'react';
import { useVoiceTour } from '@/context/VoiceTourContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  RotateCcw,
  Headphones,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Compass,
} from 'lucide-react';

export function VoiceGuideFloatingDock() {
  const {
    isTourActive,
    currentStepIndex,
    currentStep,
    totalSteps,
    isPlaying,
    isPaused,
    isMuted,
    speechRate,
    autoNavigate,
    playCurrentStep,
    pauseVoice,
    resumeVoice,
    nextStep,
    prevStep,
    stopTour,
    toggleMute,
    setSpeechRate,
    setAutoNavigate,
    currentSubtitle,
  } = useVoiceTour();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isTourActive) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-lg w-full px-3 pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl border border-slate-700/80 shadow-2xl p-4 space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500 text-slate-950 font-bold shadow-md">
              <Headphones className="w-4 h-4" />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">AI Voice Guide</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[240px] sm:max-w-xs">
                {currentStep.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isMinimized ? 'Expand guide' : 'Minimize guide'}
            >
              {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={stopTour}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Exit audio guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Body */}
        {!isMinimized && (
          <>
            {/* Live Subtitle Transcript Banner */}
            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 text-xs relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-teal-400 mb-1">
                <Sparkles className="w-3 h-3" /> Voice Narration (Live Transcript)
              </div>
              <p className="text-slate-200 leading-relaxed text-[11px] min-h-[44px]">
                {currentSubtitle || currentStep.voiceScript}
              </p>

              {/* Animated Soundwave indicator */}
              {isPlaying && (
                <div className="flex items-end gap-1 mt-2 h-3">
                  <span className="w-1 bg-teal-400 animate-pulse h-2 rounded-full" />
                  <span className="w-1 bg-teal-400 animate-pulse h-3 rounded-full" />
                  <span className="w-1 bg-teal-400 animate-pulse h-1 rounded-full" />
                  <span className="w-1 bg-teal-400 animate-pulse h-3 rounded-full" />
                  <span className="w-1 bg-teal-400 animate-pulse h-2 rounded-full" />
                  <span className="text-[10px] text-teal-400 font-mono ml-2">Speaking...</span>
                </div>
              )}
            </div>

            {/* Quick Summary Highlights for the Step */}
            <div className="space-y-1 text-[11px] text-slate-400">
              {currentStep.summaryBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-teal-400 mt-0.5">•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Control Bar */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous stop"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>

                {/* Play / Pause */}
                {isPlaying ? (
                  <button
                    onClick={pauseVoice}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-colors"
                    title="Pause narration"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={resumeVoice}
                    className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md transition-colors"
                    title="Play narration"
                  >
                    <Play className="w-3.5 h-3.5" /> {isPaused ? 'Resume' : 'Play Voice'}
                  </button>
                )}

                {/* Replay */}
                <button
                  onClick={playCurrentStep}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Replay this step"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Next */}
                <button
                  onClick={nextStep}
                  disabled={currentStepIndex === totalSteps - 1}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Next stop"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Audio Settings */}
              <div className="flex items-center gap-2">
                {/* Speed Multiplier */}
                <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold text-slate-300">
                  {[1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeechRate(rate)}
                      className={`px-1.5 py-0.5 rounded ${
                        speechRate === rate ? 'bg-teal-500 text-slate-950 font-bold' : 'hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Mute Toggle */}
                <button
                  onClick={toggleMute}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isMuted
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute voice' : 'Mute voice'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Auto Navigate Checkbox */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoNavigate}
                  onChange={(e) => setAutoNavigate(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-0"
                />
                <span>Automatically switch pages & roles as voice narrates</span>
              </label>

              <span className="font-mono text-slate-500">
                {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
