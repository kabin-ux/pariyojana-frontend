"use client"

import { useState, useEffect, useMemo } from "react"
import { projectApi } from "../services/projectsApi"
import type { Project, ProjectsApiResponse } from "../types/project"

interface UseProjectsParams {
  page?: number
  search?: string
  area?: string
  sub_area?: string
  source?: string
  expenditure_center?: string
  ward_no?: string
  status?: string
  autoLoad?: boolean
}

export const useProjects = (params: UseProjectsParams = {}) => {
  const [allData, setAllData] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { autoLoad = true, page = 1, ...apiParams } = params
  const pageSize = 10 // Set your preferred page size

  // Load all projects initially
  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      // Filter out empty string values for backend filters
      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(([key, value]) =>
          value !== "" && value !== null && value !== undefined && !['search', 'page'].includes(key)
        )
      )

      const response: ProjectsApiResponse = await projectApi.getAll(cleanParams)
      const projects = Array.isArray(response) ? response : response.results || []
      setAllData(projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setAllData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoLoad) {
      loadProjects()
    }
  }, [
    params.area,
    params.sub_area,
    params.source,
    params.expenditure_center,
    params.ward_no,
    params.status,
    autoLoad,
  ])

  // Apply frontend search and filtering
  const filteredData = useMemo(() => {
    let result = [...allData]

    // Apply search if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      result = result.filter(project =>
      (project.project_name?.toLowerCase().includes(searchLower) ||
        (project.description?.toLowerCase().includes(searchLower)) ||
        (project.operation_location?.toLowerCase().includes(searchLower)) ||
        (project.outcome?.toLowerCase().includes(searchLower)) ||
        (project.fiscal_year?.toString().includes(params.search || ""))
      ))
    }

    return result
  }, [allData, params.search])

  // Paginate the results
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredData.slice(start, end)
  }, [filteredData, page, pageSize])

  const totalCount = filteredData.length
  const hasNext = page * pageSize < totalCount
  const hasPrevious = page > 1

  return {
    data: paginatedData,
    loading,
    error,
    totalCount,
    hasNext,
    hasPrevious,
    refetch: loadProjects,
  }
}