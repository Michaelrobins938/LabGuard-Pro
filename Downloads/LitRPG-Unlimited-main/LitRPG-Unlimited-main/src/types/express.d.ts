import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface QuestData {
  name: string;
  steps: string[];
  completedBy: string[];
}

export interface HouseData {
  name: string;
  points: number;
}

export interface Houses {
  celestialOrder: HouseData;
  kitsuneClan: HouseData;
  luminaeSanctum: HouseData;
  umbralCovenant: HouseData;
}

export interface Quest {
  name: string;
  steps: string[];
  completedBy: string[];
}

export interface Quests {
  [key: string]: Quest;
} 