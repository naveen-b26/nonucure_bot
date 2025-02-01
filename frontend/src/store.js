// src/store.js
import {create} from "zustand";

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
    naturalHair: "",
    goal: "",
    hairFall: "",
    mainConcern: "",
  },
  setFormData: (newData) =>
    set((state) => ({ formData: { ...state.formData, ...newData } })),
}));

export default useStore;
