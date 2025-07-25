import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: 'active' | 'inactive' | 'maintenance' | 'calibration_due';
  location: string;
  lastCalibration?: string;
  nextCalibration?: string;
  laboratoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface EquipmentStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  calibrationDue: number;
}

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<EquipmentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipment = async (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.equipment.getAll(params);
      setEquipment(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.equipment.getStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch equipment stats:', err);
    }
  };

  const createEquipment = async (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.equipment.create(equipmentData);
      setEquipment(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create equipment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateEquipment = async (id: string, equipmentData: Partial<Equipment>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.equipment.update(id, equipmentData);
      setEquipment(prev => prev.map(item => item.id === id ? response.data : item));
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update equipment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.equipment.delete(id);
      setEquipment(prev => prev.filter(item => item.id !== id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete equipment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getEquipmentById = async (id: string) => {
    try {
      const response = await apiService.equipment.getById(id);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch equipment';
      return { success: false, error: errorMessage };
    }
  };

  const getCalibrationHistory = async (id: string) => {
    try {
      const response = await apiService.equipment.getCalibrationHistory(id);
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch calibration history';
      return { success: false, error: errorMessage };
    }
  };

  // Load initial data
  useEffect(() => {
    fetchEquipment();
    fetchStats();
  }, []);

  return {
    equipment,
    stats,
    loading,
    error,
    fetchEquipment,
    fetchStats,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentById,
    getCalibrationHistory,
    clearError: () => setError(null)
  };
} 