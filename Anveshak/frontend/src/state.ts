import { create } from 'zustand';

interface AnalysisState {
  analysisResult: any; // Replace 'any' with a proper type for your analysis data
  setAnalysisResult: (result: any) => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  analysisResult: null,
  setAnalysisResult: (result) => set({ analysisResult: result }),
}));
