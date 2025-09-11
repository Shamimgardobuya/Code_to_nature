// src/services/rewards.ts
import axios from "axios";

// -----------------------------
// Types
// -----------------------------
export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  available: boolean;
  category_display: string;
  popular?: boolean;
  icon: string;
}

export interface Redemption {
  id: string;
  reward_name: string;
  reward_icon: string;
  cost: number;
  date: string;
}

export interface RedeemResponse {
  remaining_credits: number;
  redemption: Redemption;
  message?: string;
}

// -----------------------------
// Axios instance
// -----------------------------
const API_BASE = import.meta.env.VITE_API_URL || "https://code-to-nature.onrender.com/api";

// axios instance with auth header support
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from localStorage (sync with AuthProvider)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------
// Reward Service
// -----------------------------
export const rewardService = {
  updateToken(token: string) {
    localStorage.setItem("authToken", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
  },

  async getAllRewards(): Promise<Reward[]> {
    const res = await api.get("/rewards/");
    return res.data;
  },

  async getRedemptions(): Promise<Redemption[]> {
    const res = await api.get("/rewards/redemptions/");
    return res.data;
  },

  async redeemReward(rewardId: number): Promise<RedeemResponse> {
    return api.post("/rewards/redeem/", { reward_id: rewardId });
  },
};