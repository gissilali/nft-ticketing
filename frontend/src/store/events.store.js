import { create } from "zustand";

export const useEventsStore = create((set) => ({
  events: [],
  addEvent: (event) => {
    return set((state) => {
      return {
        events: [event, ...state.events],
      };
    });
  },
  updateEvents: (events) => {
    return set({
      events,
    });
  },
}));
