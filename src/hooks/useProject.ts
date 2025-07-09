import { useState, useEffect } from 'react';
import { projectApi } from '../services/projectsApi';
import type { Project, ProjectsApiResponse } from '../types/project';

interface UseProjectsParams {
    page?: number;
    search?: string;
    area?: string;
    sub_area?: string;
    source?: string;
    status?: string;
    autoLoad?: boolean;
}

export const useProjects = (params: UseProjectsParams = {}) => {
    const [data, setData] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const { autoLoad = true, ...apiParams } = params;

    const loadProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response: ProjectsApiResponse = await projectApi.getAll(apiParams);
            if (Array.isArray(response)) {
                setData(response);
                setTotalCount(response.length);
                setHasNext(false);
                setHasPrevious(false);
            } else {
                setData(response.results || []);
                setTotalCount(response.count || 0);
                setHasNext(!!response.next);
                setHasPrevious(!!response.previous);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            setData([]);
            setTotalCount(0);
            setHasNext(false);
            setHasPrevious(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (autoLoad) {
            loadProjects();
        }
        console.log("projects", data)
    }, [
        params.page,
        params.search,
        params.area,
        params.sub_area,
        params.source,
        params.status,
        autoLoad
    ]);

    return {
        data,
        loading,
        error,
        totalCount,
        hasNext,
        hasPrevious,
        refetch: loadProjects
    };
};