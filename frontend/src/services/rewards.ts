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
const API_BASE =
  import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------
// Reward Service
// -----------------------------
export const rewardService = {
  // Manually update token if needed
  updateToken(token: string) {
    localStorage.setItem("authToken", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  // Get all rewards
  async getAllRewards(): Promise<Reward[]> {
    const res = await api.get<Reward[]>("/rewards/");
    return res.data;
  },

  // Get user redemptions
  async getRedemptions(): Promise<Redemption[]> {
    const res = await api.get<Redemption[]>("/rewards/redemptions/");
    return res.data;
  },

  // Redeem a reward
  async redeemReward(rewardId: number): Promise<RedeemResponse> {
    const res = await api.post<RedeemResponse>("/rewards/redeem/", {
      reward_id: rewardId,
    });
    return res.data;
  },
};
