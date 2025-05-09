// src/store.js
import { create } from 'zustand';

const useStore = create((set) => ({
  formData: {
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    healthConcern: "",
    hairStage: "",
    dandruff: "",
    dandruffStage: "",
    thinningOrBaldSpots: "",
    energyLevels: "",
    naturalHair: "",
    goal: "",
    hairFall: "",
    mainConcern: "",
    severeIllness: "",
    hairLossGenetic: "",
    stressLevel: "",
    sleepQuality: "",
    planningForBaby: "",
  },
  responses: {
    healthConcern: "",
    hairStage: "",
    dandruff: "",
    dandruffStage: "",
    energyLevels: "",
    naturalHair: "",
    goal: "",
    hairFall: "",
    mainConcern: "",
    severeIllness: "",
    hairLossGenetic: "",
    stressLevel: "",
    sleepQuality: "",
  },
  userId: null,
  step: 0, // Added step tracking

  setUserId: (id) => set({ userId: id }),

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
        ...(data.dandruff === "No" ? { dandruffStage: null } : {}),
      },
    })),

  setResponses: (data) =>
    set((state) => ({
      responses: {
        ...state.responses,
        ...data,
        ...(data.dandruff === "No" ? { dandruffStage: null } : {}),
      },
    })),

  setStep: (step) => set({ step }),

  clearStore: () =>
    set(() => ({
      formData: {
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        healthConcern: "",
        hairStage: "",
        dandruff: "",
        dandruffStage: "",
        thinningOrBaldSpots: "",
        energyLevels: "",
        naturalHair: "",
        goal: "",
        hairFall: "",
        mainConcern: "",
        severeIllness: "",
        hairLossGenetic: "",
        stressLevel: "",
        sleepQuality: "",
        planningForBaby: "",
      },
      responses: {},
      userId: null,
      step: 0, // Reset step
    })),
}));

export default useStore;
