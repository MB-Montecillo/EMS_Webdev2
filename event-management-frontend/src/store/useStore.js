// src/store/useStore.js
import {create} from 'zustand';

const useStore = create((set) => ({
  users: [],
  events: [],
  bookings: [],
  setUsers: (users) => set({ users }),
  setEvents: (events) => set({ events }),
  setBookings: (bookings) => set({ bookings }),
}));

export default useStore;
