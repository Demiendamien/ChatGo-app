import React from "react";

import { create } from "zustand";

import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,




    getUsers : async () => {
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users : res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred");
        } finally {
            set({isUsersLoading : false});
        }
    },

    getMessages : async (userId) => {
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages : res.data});
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "An error occurred");
        } finally {
            set({isMessagesLoading : false});
        }
    },

    sendMessage: async (messageData) => {
      const { selectedUser, messages } = get();
      if (!selectedUser) return;
      try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "An error occurre");
      }
    },



    setSelectedUser: (selectedUser) => set({ selectedUser}),

    subscribeToMessages: () => {
      const socket = useAuthStore.getState().socket;
      const { selectedUser } = get();
      if (!socket) return;
  
      socket.on("newMessage", (newMessage) => {
        // Ajoute ce filtre pour n'ajouter que les messages de la conversation courante
        if (
          !selectedUser ||
          (newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id)
        ) return;
  
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });
    },

    
  
    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      if (socket && typeof socket.off === "function") {
        socket.off("newMessage");
      }
    },
    
    // setMessages: (messages) => set({ messages }),
    // addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

    // socket: null,
    // setSocket: (socket) => set({ socket }),

    // selectedChat: null,
    // setSelectedChat: (chat) => set({ selectedChat: chat }),
    // updateSelectedChat: (chat) => set((state) => ({ selectedChat: { ...state.selectedChat, ...chat } })),
    // resetSelectedChat: () => set({ selectedChat: null }),
    // removeSelectedChat: () => set({ selectedChat: null }),
    // resetMessages: () => set({ messages: [] }),
    // resetSocket: () => set({ socket: null }),
}));