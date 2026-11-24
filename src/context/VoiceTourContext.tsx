'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { TourStep, TourRole, COMPLETE_VOICE_TOUR } from '@/types/tour';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface VoiceTourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  speechRate: number;
  autoNavigate: boolean;
  startTour: (role?: TourRole, startIndex?: number) => void;
  stopTour: () => void;
  playCurrentStep: () => void;
  pauseVoice: () => void;
  resumeVoice: () => void;
  nextStep: () => void;
  prevStep: () => void;
  toggleMute: () => void;
  setSpeechRate: (rate: number) => void;
  setAutoNavigate: (val: boolean) => void;
  currentSubtitle: string;
}

const VoiceTourContext = createContext<VoiceTourContextType | undefined>(undefined);

export function VoiceTourProvider({ children }: { children: ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRateState] = useState(1.0);
  const [autoNavigate, setAutoNavigateState] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  const router = useRouter();
  const { switchRole } = useAuth();
  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = COMPLETE_VOICE_TOUR[currentStepIndex] || COMPLETE_VOICE_TOUR[0];
  const totalSteps = COMPLETE_VOICE_TOUR.length;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, []);

  const speakText = (text: string, rate: number = speechRate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech API not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);

    if (isMuted) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSubtitle(text);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick best available English voice (en-IN or natural English)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((v) => v.lang === 'en-IN') ||
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentSubtitle(text);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);

      // Auto-advance to next step after brief pause if autoNavigate is enabled
      if (autoNavigate && isTourActive) {
        autoNextTimeoutRef.current = setTimeout(() => {
          setCurrentStepIndex((prev) => {
            if (prev < totalSteps - 1) {
              const nextIdx = prev + 1;
              const next = COMPLETE_VOICE_TOUR[nextIdx];
              if (next) {
                if (next.role !== 'all') {
                  switchRole(next.role);
                }
                router.push(next.targetRoute);
                speakText(next.voiceScript);
              }
              return nextIdx;
            } else {
              setIsTourActive(false);
              return prev;
            }
          });
        }, 1800);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startTour = (role: TourRole = 'all', startIndex: number = 0) => {
    setIsTourActive(true);
    let targetIndex = startIndex;

    if (role !== 'all') {
      const foundIdx = COMPLETE_VOICE_TOUR.findIndex((s) => s.role === role);
      if (foundIdx !== -1) targetIndex = foundIdx;
    }

    setCurrentStepIndex(targetIndex);
    const step = COMPLETE_VOICE_TOUR[targetIndex];

    if (step.role !== 'all') {
      switchRole(step.role);
    }
    router.push(step.targetRoute);
    speakText(step.voiceScript);
  };

  const stopTour = () => {
    setIsTourActive(false);
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSubtitle('');
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playCurrentStep = () => {
    speakText(currentStep.voiceScript);
  };

  const pauseVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resumeVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
      } else {
        speakText(currentStep.voiceScript);
      }
    }
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= totalSteps) return;
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);

    setCurrentStepIndex(index);
    const step = COMPLETE_VOICE_TOUR[index];

    if (autoNavigate) {
      if (step.role !== 'all') {
        switchRole(step.role);
      }
      router.push(step.targetRoute);
    }

    speakText(step.voiceScript);
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      stopTour();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
      } else {
        speakText(currentStep.voiceScript);
      }
      return next;
    });
  };

  const setSpeechRate = (rate: number) => {
    setSpeechRateState(rate);
    if (isPlaying) {
      speakText(currentStep.voiceScript, rate);
    }
  };

  return (
    <VoiceTourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep,
        totalSteps,
        isPlaying,
        isPaused,
        isMuted,
        speechRate,
        autoNavigate,
        startTour,
        stopTour,
        playCurrentStep,
        pauseVoice,
        resumeVoice,
        nextStep,
        prevStep,
        toggleMute,
        setSpeechRate,
        setAutoNavigate: setAutoNavigateState,
        currentSubtitle,
      }}
    >
      {children}
    </VoiceTourContext.Provider>
  );
}

export function useVoiceTour() {
  const context = useContext(VoiceTourContext);
  if (!context) {
    throw new Error('useVoiceTour must be used within a VoiceTourProvider');
  }
  return context;
}
