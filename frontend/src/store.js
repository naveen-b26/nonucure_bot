// src/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
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
      },
      responses: {},
      userId: null,
      setUserId: (id) => set({ userId: id }),
      setFormData: (data) => set((state) => ({ 
        formData: { ...state.formData, ...data } 
      })),
      setResponses: (data) => set((state) => ({ 
        responses: { ...state.responses, ...data } 
      })),
      clearStore: () => set({ 
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
        }, 
        responses: {},
        userId: null
      }),
    }),
    {
      name: 'hair-care-store', // name for the localStorage key
    }
  )
);

export default useStore;
