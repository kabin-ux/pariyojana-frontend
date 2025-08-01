"use client"

import type React from "react"

interface SearchAndFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  onFilterChange: (filterName: string, value: string) => void
  onClearFilters: () => void
  filters: {
    area: string
    sub_area: string
    source: string
    expenditure_center: string
    ward_no: string
    status: string
  }
  thematicAreas: any[]
  sub_areas: any[]
  sources: any[]
  expenditureCenters: any[]
  wardOptions: any[]
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  filters,
  thematicAreas,
  sub_areas,
  sources,
  expenditureCenters,
  wardOptions,
}) => {
  const statusOptions = [
    { value: "not_started", label: "सुरु भएको छैन" },
    { value: "in_progress", label: "कार्यरत" },
    { value: "completed", label: "सम्पन्न" },
    { value: "cancelled", label: "रद्द" },
  ]

  // Filter sub-areas based on selected thematic area
  const filteredSubAreas = sub_areas.filter((sub_area) => {
    if (!filters.area) return true
    return (sub_area as any).thematic_area?.toString() === filters.area
  })

  const handleAreaChange = (value: string) => {
    console.log("Area filter changed to:", value)
    onFilterChange("area", value)
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="परियोजना खोज्नुहोस्"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Thematic Area Filter */}
        <select
          value={filters?.area || ""}
          onChange={(e) => handleAreaChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">सबै विषयगत क्षेत्र</option>
          {thematicAreas?.map((area) => (
            <option key={area?.id} value={area?.id?.toString()}>
              {area.name}
            </option>
          ))}
        </select>

        {/* Sub-Area Filter */}
        <select
          value={filters?.sub_area || ""}
          onChange={(e) => onFilterChange("sub_area", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={!filters.area}
        >
          <option value="">सबै उप-क्षेत्र</option>
          {filteredSubAreas?.map((sub) => (
            <option key={sub.id} value={sub.id?.toString()}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* Source Filter */}
        <select
          value={filters?.source || ""}
          onChange={(e) => onFilterChange("source", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">सबै स्रोत</option>
          {sources?.map((source) => (
            <option key={source.id} value={source.id?.toString()}>
              {source.name}
            </option>
          ))}
        </select>

        {/* Expenditure Center Filter */}
        <select
          value={filters?.expenditure_center || ""}
          onChange={(e) => onFilterChange("expenditure_center", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">सबै खर्च केन्द्र</option>
          {expenditureCenters?.map((center) => (
            <option key={center.id} value={center.id?.toString()}>
              {center.name}
            </option>
          ))}
        </select>

        {/* Ward Filter */}
        <select
          value={filters?.ward_no || ""}
          onChange={(e) => onFilterChange("ward_no", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">सबै वडा</option>
          {wardOptions?.map((ward) => (
            <option key={ward.value} value={ward.value?.toString()}>
              {ward.label}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters?.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">सबै स्थिति</option>
          {statusOptions?.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={onClearFilters}
        className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
      >
        फिल्टर हटाउनुहोस्
      </button>

      {/* Debug Info */}
      <div className="mt-2 text-xs text-gray-500">
        Active filters: Area={filters.area}, Sub-area={filters.sub_area}, Source={filters.source}, Expenditure=
        {filters.expenditure_center}, Ward={filters.ward_no}, Status={filters.status}
      </div>

      {/* Active Filters Display */}
      {(filters.area ||
        filters.sub_area ||
        filters.source ||
        filters.expenditure_center ||
        filters.ward_no ||
        filters.status ||
        searchTerm) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">सक्रिय फिल्टरहरू:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              खोज: {searchTerm}
              <button onClick={() => onSearchChange("")} className="ml-1 text-blue-600 hover:text-blue-800">
                ×
              </button>
            </span>
          )}
          {filters.area && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              विषयगत क्षेत्र: {thematicAreas.find((a) => a.id.toString() === filters.area)?.name}
              <button onClick={() => onFilterChange("area", "")} className="ml-1 text-green-600 hover:text-green-800">
                ×
              </button>
            </span>
          )}
          {filters.sub_area && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              उप-क्षेत्र: {sub_areas.find((s) => s.id.toString() === filters.sub_area)?.name}
              <button
                onClick={() => onFilterChange("sub_area", "")}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.source && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
              स्रोत: {sources.find((s) => s.id.toString() === filters.source)?.name}
              <button
                onClick={() => onFilterChange("source", "")}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.expenditure_center && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
              खर्च केन्द्र: {expenditureCenters.find((e) => e.id.toString() === filters.expenditure_center)?.name}
              <button
                onClick={() => onFilterChange("expenditure_center", "")}
                className="ml-1 text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.ward_no && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
              वडा: {wardOptions.find((w) => w.value.toString() === filters.ward_no)?.label}
              <button
                onClick={() => onFilterChange("ward_no", "")}
                className="ml-1 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              स्थिति: {statusOptions.find((s) => s.value === filters.status)?.label}
              <button onClick={() => onFilterChange("status", "")} className="ml-1 text-gray-600 hover:text-gray-800">
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchAndFilter
