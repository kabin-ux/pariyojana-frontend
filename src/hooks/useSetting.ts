import { useState, useEffect } from 'react';
import { settingsApi } from '../services/settingsApi';
import { type SettingsItem } from '../types/settings';

export const useSettings = (tabName: string, activeOnly: boolean = false) => {
  const [data, setData] = useState<SettingsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await settingsApi.getAll(tabName);
      const filtered = activeOnly ? result.filter(item => item.is_active) : result;
      setData(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
      console.error("useSettings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tabName) {
      loadData();
    }
  }, [tabName, activeOnly]);

  return { data, loading, error, refetch: loadData };
};