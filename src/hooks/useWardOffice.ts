// src/hooks/useWardOffice.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface Project {
  id: number;
  title: string;
  date: string;
  [key: string]: any;
}

export const useWardOffice = () => {
  const [wardProjects, setWardProjects] = useState<Project[]>([]);
  const [municipalityProjects, setMunicipalityProjects] = useState<Project[]>([]);
  const [thematicProjects, setThematicProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wardRes, muniRes, thematicRes] = await Promise.all([
        axios.get('http://localhost:8000/api/planning/ward-office/ward-projects/'),
        axios.get('http://localhost:8000/api/planning/ward-office/municipality-projects/'),
        axios.get('http://localhost:8000/api/planning/ward-office/ward-thematic-projects/'),
      ]);

      setWardProjects(wardRes.data || []);
      setMunicipalityProjects(muniRes.data || []);
      setThematicProjects(thematicRes.data || []);
    } catch (err: any) {
      setError('डेटा लोड गर्न असफल भयो।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    wardProjects,
    municipalityProjects,
    thematicProjects,
    loading,
    error,
  };
};
