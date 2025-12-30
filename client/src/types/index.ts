// Type definitions for RFID Asset Management System

export interface Environment {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Asset {
  id: string;
  epc: string;
  name: string;
  description?: string;
  current_ambiente_id: string; 
  last_seen?: Date;          
  createdAt: Date;
}

export interface Sensor {
  id: string;
  name: string;
  exit_to_ambiente: string; 
  entry_to_ambiente: string; 
  createdAt: Date;
}

export interface MovementLog {
  id: string;
  assetId: string;
  sensorId: string;
  fromEnvironmentId: string;
  toEnvironmentId: string;
  timestamp: Date;
  status: 'valid' | 'suspicious' | 'unknown';
}

export interface DashboardStats {
  totalAssets: number;
  totalEnvironments: number;
  totalSensors: number;
  recentMovements: number;
}
