import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Environment, Asset, Sensor, MovementLog } from '../types';
import { getMovementLogs } from "../services/movimentacaoService";
import { getEnvironments, createEnvironment, updateEnvironment, deleteEnvironment } from "../services/ambienteService";
import { getAssets, createAsset, deleteAsset } from "../services/patrimonioService";
import { createSensor, getSensors, deleteSensor as deleteSensorApi, updateSensor as updateSensorApi } from '../services/sensorService';
import { createMovement } from "../services/movimentacaoService";
import { toast } from "sonner";

interface AppContextType {
  environments: Environment[];
  assets: Asset[];
  sensors: Sensor[];
  movementLogs: MovementLog[];
  
  // Environment operations
  createEnvironment: (environment: Omit<Environment, 'id' | 'createdAt'>) => Promise<void>;
  updateEnvironment: (id: string, environment: Partial<Environment>) => void;
  deleteEnvironment: (id: string) => void;
  
  // Asset operations
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => Promise<void>;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  
  // Sensor operations
  createSensor: (sensor: Omit<Sensor, 'id' | 'createdAt'>) => Promise<void>;
  updateSensor: (id: string, sensor: Partial<Sensor>) => void;
  deleteSensor: (id: string) => void;
  
  // Movement log operations
  addMovementLog: (data: { epc: string; sensor: string }) => Promise<void>;
  updateMovementLog: (id: string, log: Partial<MovementLog>) => void;

  // Utilities
  getEnvironmentById: (id: string) => Environment | undefined;
  getAssetById: (id: string) => Asset | undefined;
  getSensorById: (id: string) => Sensor | undefined;
  getAssetsByEnvironment: (environmentId: string) => Asset[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>([]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [environmentsData, assetsData, sensorsData, movementsData] = await Promise.all([
          getEnvironments(),
          getAssets(),
          getSensors(),
          getMovementLogs(),
        ]);

        setEnvironments(environmentsData);
        setAssets(assetsData);
        setSensors(sensorsData);
        setMovementLogs(movementsData)
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      }
    }

    fetchInitialData();
  }, []);

  // Environment operations
  const createEnvironmentState = async (environment: Omit<Environment, 'id' | 'createdAt'>) => {
  try {
    const saved = await createEnvironment(environment); // envia para API
    setEnvironments(prev => [...prev, saved]); // adiciona retorno 
      } catch (error) {
    console.error("Erro ao criar ambiente:", error);
    }
  };

  const updateEnvironmentState = async (
    id: string,
    updatedData: Partial<Environment>
  ) => {
    try {
      const updated = await updateEnvironment(id, updatedData);

      setEnvironments(prev =>
        prev.map(env =>
          env.id === id ? { ...env, ...updated } : env
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar ambiente:", error);
    }
  };

  const deleteEnvironmentState = async (id: string) => {
    try {
      await deleteEnvironment(id);

      setEnvironments(prev =>
        prev.filter(env => env.id !== id)
      );
    } catch (error) {
      console.error("Erro ao deletar ambiente:", error);
    }
  };

  // Asset operations
  const addAsset = async (asset: Omit<Asset, 'id' | 'createdAt'>) => {
  try {
    const saved = await createAsset(asset); // envia para API
    setAssets(prev => [...prev, saved]); // adiciona retorno 
      } catch (error) {
    console.error("Erro ao criar patrimônio:", error);
    }
  };

  const updateAsset = (id: string, updatedData: Partial<Asset>) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, ...updatedData } : asset
    ));
  };

  const deleteAssetState = async (id: string) => {
    try {
      await deleteAsset(id);

      setAssets(prev =>
        prev.filter(asset => asset.id !== id)
      );
    } catch (error) {
      console.error("Erro ao deletar patrimônio:", error);
    }
  };

  // Sensor operations
  const createSensorState = async (sensor: Omit<Sensor, 'id' | 'createdAt'>) => {
  try {
    const saved = await createSensor(sensor); 
    setSensors(prev => [...prev, saved]); 
      } catch (error) {
    console.error("Erro ao criar sensor:", error);
    }
  };

  const updateSensorState = async (id: string, updatedData: Partial<Sensor>) => {
    try {
      await updateSensorApi(id, updatedData);
      setSensors(prev => prev.map(sensor =>
        sensor.id === id ? { ...sensor, ...updatedData } : sensor
      ));
    } catch (error) {
      console.error("Erro ao atualizar sensor:", error);
    }
  };

  const deleteSensorState = async (id: string) => {
    try {
      await deleteSensorApi(id);
      setSensors(prev => prev.filter(sensor => sensor.id !== id));
    } catch (error) {
      console.error("Erro ao deletar sensor:", error);
    }
  };

  // Movement log operations
  const addMovementLog = async (data: { epc: string; sensor: string }) => {
    try {
      const savedLog = await createMovement(data);
      setMovementLogs(prev => [savedLog, ...prev]);

      toast.success("Movimentação registrada", {
        description: `EPC ${data.epc} detectado no sensor ${savedLog.sensor}.`,
      });

      // Sincroniza o estado do patrimônio no Front-end 
      updateAsset(savedLog.patrimonio, {
        current_ambiente: savedLog.to_ambiente,
        last_seen: new Date(),
      }
    );

    } catch (error) {
      console.error("Erro ao registrar movimentação:", error);
      toast.error("Erro na leitura", {
        description: "O EPC lido não consta na base de dados.",
      });
    }
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
    assets.filter(asset => asset.current_ambiente === environmentId);

  return (
    <AppContext.Provider
      value={{
        environments,
        assets,
        sensors,
        movementLogs,
        createEnvironment: createEnvironmentState,
        updateEnvironment: updateEnvironmentState,
        deleteEnvironment: deleteEnvironmentState,
        addAsset,
        updateAsset,
        deleteAsset : deleteAssetState,
        createSensor : createSensorState,
        updateSensor: updateSensorState,
        deleteSensor: deleteSensorState,
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