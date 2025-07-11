import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSignUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  messages: [], // optionnel, si pas déjà géré dans useChatStore

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSignUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      set({ isSignUp: false });
    }
  },

  login: async (data) => {
  set({ isLoggingIn: true });
  try {
    const res = await axiosInstance.post("/auth/login", data);
    
    console.log("Réponse de connexion:", res.data);
    
    set({ authUser: res.data });
    
    // AJOUTER CETTE LIGNE - stocker le token séparément
    localStorage.setItem('token', res.data.token);
    
    toast.success("Logged in successfully");
    get().connectSocket();
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error.message || "An error occurred"
    );
  } finally {
    set({ isLoggingIn: false });
  }
},

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem('token'); // AJOUTER CETTE LIGNE
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "An error occurred"
      );
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser?._id || get().socket?.connected) return;

    const socket = io(
      import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL,
      {
        path: "/socket.io",
        query: { userId: authUser._id },
        withCredentials: true,
      }
    );
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // subscribeToMessages: () => {
  //   const { selectedUser } = get();
  //   if (!selectedUser) return;

  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.on("newMessage", (newMessage) => {
  //     const currentMessages = get().messages || [];
  //     set({
  //       messages: [...currentMessages, newMessage],
  //     });
  //   });
  // },

  // unsubscribeFromMessages: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (socket && typeof socket.off === "function") {
  //     socket.off("newMessage");
  //   }
  // },
}));
