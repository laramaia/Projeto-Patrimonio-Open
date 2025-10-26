// Type definitions for RFID Asset Management System

export interface Environment {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Asset {
  id: string;
  epc: string; // RFID tag EPC (unique)
  name: string;
  description?: string;
  currentEnvironmentId: string;
  lastReadAt?: Date;
  createdAt: Date;
}

export interface Sensor {
  id: string;
  name: string;
  exitEnvironmentId: string;
  entryEnvironmentId: string;
  isActive: boolean;
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
