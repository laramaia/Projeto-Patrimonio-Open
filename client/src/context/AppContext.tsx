import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Environment, Asset, Sensor, MovementLog } from '../types';
import { mockEnvironments, mockAssets, mockSensors, mockMovementLogs } from '../lib/mockData';

interface AppContextType {
  environments: Environment[];
  assets: Asset[];
  sensors: Sensor[];
  movementLogs: MovementLog[];
  
  // Environment operations
  addEnvironment: (environment: Omit<Environment, 'id' | 'createdAt'>) => void;
  updateEnvironment: (id: string, environment: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  
  // Asset operations
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  
  // Sensor operations
  addSensor: (sensor: Omit<Sensor, 'id' | 'createdAt'>) => void;
  updateSensor: (id: string, sensor: Partial<Sensor>) => void;
  deleteSensor: (id: string) => void;
  
  // Movement log operations
  addMovementLog: (log: Omit<MovementLog, 'id' | 'timestamp'>) => void;
  updateMovementLog: (id: string, log: Partial<MovementLog>) => void;

  // Utilities
  getEnvironmentById: (id: string) => Environment | undefined;
  getAssetById: (id: string) => Asset | undefined;
  getSensorById: (id: string) => Sensor | undefined;
  getAssetsByEnvironment: (environmentId: string) => Asset[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [environments, setEnvironments] = useState<Environment[]>(mockEnvironments);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>(mockMovementLogs);

  // Environment operations
  const addEnvironment = (environment: Omit<Environment, 'id' | 'createdAt'>) => {
    const newEnvironment: Environment = {
      ...environment,
      id: `env-${Date.now()}`,
      createdAt: new Date(),
    };
    setEnvironments([...environments, newEnvironment]);
  };

  const updateEnvironment = (id: string, updatedData: Partial<Environment>) => {
    setEnvironments(environments.map(env => 
      env.id === id ? { ...env, ...updatedData } : env
    ));
  };

  const deleteEnvironment = (id: string) => {
    setEnvironments(environments.filter(env => env.id !== id));
  };

  // Asset operations
  const addAsset = (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date(),
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, updatedData: Partial<Asset>) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, ...updatedData } : asset
    ));
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  // Sensor operations
  const addSensor = (sensor: Omit<Sensor, 'id' | 'createdAt'>) => {
    const newSensor: Sensor = {
      ...sensor,
      id: `sensor-${Date.now()}`,
      createdAt: new Date(),
    };
    setSensors([...sensors, newSensor]);
  };

  const updateSensor = (id: string, updatedData: Partial<Sensor>) => {
    setSensors(sensors.map(sensor => 
      sensor.id === id ? { ...sensor, ...updatedData } : sensor
    ));
  };

  const deleteSensor = (id: string) => {
    setSensors(sensors.filter(sensor => sensor.id !== id));
  };

  // Movement log operations
  const addMovementLog = (log: Omit<MovementLog, 'id' | 'timestamp'>) => {
    const newLog: MovementLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date(),
    };
    setMovementLogs([newLog, ...movementLogs]);

    // Update asset's current environment and last read time
    updateAsset(log.assetId, {
      currentEnvironmentId: log.toEnvironmentId,
      lastReadAt: new Date(),
    });
  };

  const updateMovementLog = (id: string, updatedData: Partial<MovementLog>) => {
    setMovementLogs(movementLogs.map(log =>
      log.id === id ? { ...log, ...updatedData } : log
    ));
  };

  // Utilities
  const getEnvironmentById = (id: string) => 
    environments.find(env => env.id === id);

  const getAssetById = (id: string) => 
    assets.find(asset => asset.id === id);

  const getSensorById = (id: string) => 
    sensors.find(sensor => sensor.id === id);

  const getAssetsByEnvironment = (environmentId: string) => 
    assets.filter(asset => asset.currentEnvironmentId === environmentId);

  return (
    <AppContext.Provider
      value={{
        environments,
        assets,
        sensors,
        movementLogs,
        addEnvironment,
        updateEnvironment,
        deleteEnvironment,
        addAsset,
        updateAsset,
        deleteAsset,
        addSensor,
        updateSensor,
        deleteSensor,
        addMovementLog,
        updateMovementLog,
        getEnvironmentById,
        getAssetById,
        getSensorById,
        getAssetsByEnvironment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
