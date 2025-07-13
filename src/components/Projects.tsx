import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreHorizontal, ChevronRight, ChevronLeft, Home, Edit, Trash2, X } from 'lucide-react';
import ProjectDetail from './ProjectDetail';
import { useSettings } from '../hooks/useSetting';
import { useProjects } from '../hooks/useProject';
import { projectApi } from '../services/projectsApi';
import { formatBudget, formatWardNumber, formatStatus, getStatusColor, getNameById, toNepaliNumber } from '../utils/formatters';
import toast from 'react-hot-toast';

interface ProjectsProps {
  onProjectSelect?: (projectId: string) => void;
}

interface NewProjectForm {
  project_name: string;
  area: string;
  sub_area: string;
  project_level: string;
  expenditure_title: string;
  expenditure_center: string;
  budget: string;
  source: string;
  operation_location: string;
  ward_no: string;
  location_gps: string;
  outcome: string;
  unit: string;
  description: string;
  fiscal_year: string;
}

const Projects: React.FC<ProjectsProps> = ({ onProjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const [formData, setFormData] = useState<NewProjectForm>({
    project_name: '',
    area: '',
    sub_area: '',
    project_level: '',
    expenditure_title: '',
    expenditure_center: '',
    budget: '',
    source: '',
    operation_location: '',
    ward_no: '',
    location_gps: '',
    outcome: '',
    unit: '',
    description: '',
    fiscal_year: ''
  });


  // Fetch dynamic dropdown data
  const { data: thematicAreas } = useSettings('विषयगत क्षेत्र', true);
  const { data: sub_areas } = useSettings('उप-क्षेत्र', true);
  const { data: projectLevels } = useSettings('योजनाको स्तर', true);
  const { data: expenditureTitles } = useSettings('खर्च शिर्षक', true);
  const { data: expenditureCenters } = useSettings('खर्च केन्द्र', true);
  const { data: sources } = useSettings('स्रोत', true);
  const { data: units } = useSettings('इकाई', true);
  const { data: fiscalYears } = useSettings('आर्थिक वर्ष', true);

  // Fetch projects from API
  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    totalCount,
    hasNext,
    hasPrevious,
    refetch: refetchProjects
  } = useProjects({
    page: currentPage,
    search: searchTerm
  });
 
  // Ward options with proper mapping
  const wardOptions = [
    { value: 1, label: 'वडा नं. - १' },
    { value: 2, label: 'वडा नं. - २' },
    { value: 3, label: 'वडा नं. - ३' },
    { value: 4, label: 'वडा नं. - ४' },
    { value: 5, label: 'वडा नं. - ५' },
    { value: 6, label: 'वडा नं. - ६' },
  ];

  // Filter sub-areas based on selected thematic area
  const filteredsub_areas = sub_areas.filter(sub_area => {
    if (!formData.area) return true;
    const selectedThematicArea = thematicAreas.find(area => area.id.toString() === formData.area);
    return (sub_area as any).thematic_area === selectedThematicArea?.id;
  });

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);


  const handleEdit = async (id: number) => {
    try {
      // Find the project to edit
      const projectToEdit = projects.find(project => project.serial_number === id);
      if (!projectToEdit) {
        console.error('Project not found');
        return;
      }

      // Set form data with the project's current values
      setFormData({
        project_name: projectToEdit.project_name || '',
        area: projectToEdit.area?.toString() || '',
        sub_area: projectToEdit.sub_area?.toString() || '',
        project_level: projectToEdit.project_level?.toString() || '',
        expenditure_title: projectToEdit.expenditure_title?.toString() || '',
        expenditure_center: projectToEdit.expenditure_center?.toString() || '',
        budget: projectToEdit.budget?.toString() || '',
        source: projectToEdit.source?.toString() || '',
        operation_location: projectToEdit.operation_location || '',
        ward_no: projectToEdit.ward_no?.toString() || '',
        location_gps: projectToEdit.location_gps || '',
        outcome: projectToEdit.outcome || '',
        unit: projectToEdit.unit?.toString() || '',
        description: projectToEdit.description || '',
        fiscal_year: projectToEdit.fiscal_year?.toString() || ''
      });

      // Open the dialog for editing
      setIsDialogOpen(true);
      setDropdownOpen(null);
      setEditingProjectId(projectToEdit.serial_number);

      // If you need to track the project being edited
      // setSelectedProject(projectToEdit);

    } catch (error) {
      console.error('Error preparing edit:', error);
      alert('परियोजना सम्पादन गर्न सकिएन');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('के तपाईं यो परियोजना मेटाउन चाहनुहुन्छ?')) {
      try {
        await projectApi.delete(id);
        refetchProjects(); // Refresh the list
        console.log('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('परियोजना मेटाउन सकिएन');
      }
    }
    setDropdownOpen(null);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    if (onProjectSelect) {
      onProjectSelect(project.id.toString());
    }
  };

  const handleInputChange = (field: keyof NewProjectForm, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Reset sub-area when thematic area changes
      if (field === 'area') {
        newData.sub_area = '';
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        project_name: formData.project_name,
        area: formData.area ? parseInt(formData.area) : null,
        sub_area: formData.sub_area ? parseInt(formData.sub_area) : null,
        project_level: formData.project_level ? parseInt(formData.project_level) : null,
        expenditure_title: formData.expenditure_title ? parseInt(formData.expenditure_title) : null,
        expenditure_center: formData.expenditure_center ? parseInt(formData.expenditure_center) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        source: formData.source ? parseInt(formData.source) : null,
        operation_location: formData.operation_location,
        ward_no: formData.ward_no ? parseInt(formData.ward_no) : null,
        location_gps: formData.location_gps,
        outcome: formData.outcome,
        unit: formData.unit ? parseInt(formData.unit) : null,
        description: formData.description,
        fiscal_year: formData.fiscal_year ? parseInt(formData.fiscal_year) : null,
        status: 'not_started'
      };

      if (editingProjectId) {
        // Update existing project
        await projectApi.update(editingProjectId, submitData);

        toast.success('Project updated successfully');
      }
      else {
        // Create new project
        await projectApi.create(submitData);
        console.log('Project added successfully');
      }

      setIsDialogOpen(false);
      setFormData({
        project_name: '',
        area: '',
        sub_area: '',
        project_level: '',
        expenditure_title: '',
        expenditure_center: '',
        budget: '',
        source: '',
        operation_location: '',
        ward_no: '',
        location_gps: '',
        outcome: '',
        unit: '',
        description: '',
        fiscal_year: ''
      });
      refetchProjects();
      setSelectedProject(null);
      setEditingProjectId(null);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(selectedProject ? 'परियोजना अपडेट गर्न सकिएन' : 'परियोजना थप्न सकिएन');
      toast.error(editingProjectId ? 'परियोजना अपडेट गर्न सकिएन' : 'परियोजना थप्न सकिएन');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFormData({
      project_name: '',
      area: '',
      sub_area: '',
      project_level: '',
      expenditure_title: '',
      expenditure_center: '',
      budget: '',
      source: '',
      operation_location: '',
      ward_no: '',
      location_gps: '',
      outcome: '',
      unit: '',
      description: '',
      fiscal_year: ''
    });
    setEditingProjectId(null)
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <>
      <main className="flex-1 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ChevronLeft className="w-4 h-4 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>गृहपृष्ठ</span>
              <ChevronRight className="w-3 h-3 cursor-pointer" />
              <span className="text-gray-900 font-medium">परियोजनाहरू</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="text-gray-900 font-medium">आर्थिक वर्ष : २०८१/८२</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">परियोजनाहरू</h1>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नयाँ परियोजना थप्नुहोस्</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="योजना तथा कार्यक्रम खोज्नुहोस्"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Filter className="w-4 h-4" />
                <span>फिल्टरहरू</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {projectsError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">त्रुटि: {projectsError}</p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
  <table className="min-w-full divide-y divide-gray-200 text-sm">
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">क्र.स</th>
        <th className="text-left py-3 px-6 text-gray-700 font-semibold">योजना तथा कार्यक्रम</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">क्षेत्र</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">उप-क्षेत्र</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">स्रोत</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">खर्च केन्द्र</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">बजेट</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">वडा नं.</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">स्थिति</th>
        <th className="text-left py-3 px-4 text-gray-700 font-semibold">कार्यहरू</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {projectsLoading ? (
        <tr>
          <td colSpan={10} className="py-12 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-gray-500">लोड हुँदैछ...</span>
            </div>
          </td>
        </tr>
      ) : projects.length === 0 ? (
        <tr>
          <td colSpan={10} className="py-12 text-center text-gray-500">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">कुनै परियोजना फेला परेन</p>
            </div>
          </td>
        </tr>
      ) : (
        projects.map((project, index) => (
          <tr
            key={project.id}
            className="hover:bg-blue-50 transition-colors duration-150"
          >
            <td className="py-3 px-4 text-gray-800">{toNepaliNumber((currentPage - 1) * 10 + index + 1)}</td>
            <td className="py-3 px-6 text-gray-900 max-w-xs truncate">{project.project_name}</td>
            <td className="py-3 px-4 text-gray-800">{getNameById(thematicAreas, project.area)}</td>
            <td className="py-3 px-4 text-gray-800">{getNameById(sub_areas, project.sub_area)}</td>
            <td className="py-3 px-4 text-gray-800">{getNameById(sources, project.source)}</td>
            <td className="py-3 px-4 text-gray-800">{getNameById(expenditureCenters, project.expenditure_center)}</td>
            <td className="py-3 px-4 text-gray-800">{formatBudget(toNepaliNumber(project.budget))}</td>
            <td className="py-3 px-4 text-gray-800">{formatWardNumber(project.ward_no)}</td>
            <td className="py-3 px-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {formatStatus(project.status)}
              </span>
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleProjectClick(project)}
                  title="विवरण हेर्नुहोस्"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  title="सम्पादन गर्नुहोस्"
                  onClick={() => handleEdit(project.serial_number)}
                  className="text-green-600 hover:text-green-800 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  title="हटाउनुहोस्"
                  onClick={() => handleDelete(project.serial_number)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              कुल: {totalCount} वटा परियोजनाहरू
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 cursor-pointer py-1 bg-blue-600 text-white rounded text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="px-3 cursor-pointer py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">योजना तथा कार्यक्रमको विवरण</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">आर्थिक वर्ष: २०८१/८२</span>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  योजना तथा कार्यक्रमको नाम <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.project_name}
                  onChange={(e) => handleInputChange('project_name', e.target.value)}
                  placeholder="योजना तथा कार्यक्रमको नाम"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Row 1: area, Sub-area, Level */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    विषयगत क्षेत्र <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">विषयगत क्षेत्र</option>
                    {thematicAreas.map(area => (
                      <option key={area.id} value={area.id.toString()}>{area.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    उप-क्षेत्र <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.sub_area}
                    onChange={(e) => handleInputChange('sub_area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.area}
                  >
                    <option value="">उप-क्षेत्र</option>
                    {filteredsub_areas.map(sub_area => (
                      <option key={sub_area.id} value={sub_area.id.toString()}>{sub_area.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    योजनाको स्तर
                  </label>
                  <select
                    value={formData.project_level}
                    onChange={(e) => handleInputChange('project_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">योजनाको स्तर</option>
                    {projectLevels.map(level => (
                      <option key={level.id} value={level.id.toString()}>{level.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Expenditure Title, Cost Center, Amount, Fiscal Year */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    खर्च शिर्षक
                  </label>
                  <select
                    value={formData.expenditure_title}
                    onChange={(e) => handleInputChange('expenditure_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">खर्च शिर्षक</option>
                    {expenditureTitles.map(title => (
                      <option key={title.id} value={title.id.toString()}>{title.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    खर्च केन्द्र <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.expenditure_center}
                    onChange={(e) => handleInputChange('expenditure_center', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">खर्च केन्द्र</option>
                    {expenditureCenters.map(center => (
                      <option key={center.id} value={center.id.toString()}>{center.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    बजेट रु. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="बजेट"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    आर्थिक वर्ष <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.fiscal_year}
                    onChange={(e) => handleInputChange('fiscal_year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">आर्थिक वर्ष</option>
                    {fiscalYears.map(year => (
                      <option key={year.id} value={year.id.toString()}>{year.year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Source, Operation Location, Ward No */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    स्रोत <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.source}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">स्रोत</option>
                    {sources.map(source => (
                      <option key={source.id} value={source.id.toString()}>{source.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    योजना संचालन स्थान
                  </label>
                  <input
                    type="text"
                    value={formData.operation_location}
                    onChange={(e) => handleInputChange('operation_location', e.target.value)}
                    placeholder="योजना संचालन स्थान"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    वडा नं. <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.ward_no}
                    onChange={(e) => handleInputChange('ward_no', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">वडा नं.</option>
                    {wardOptions.map(option => (
                      <option key={option.value} value={option.value.toString()}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: GPS, Expected Result, Unit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    योजना संचालन स्थानको GPS CO-ORDINATE
                  </label>
                  <input
                    type="text"
                    value={formData.location_gps}
                    onChange={(e) => handleInputChange('location_gps', e.target.value)}
                    placeholder="योजना संचालन स्थानको GPS CO-ORDINATE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    सम्पन्न गर्ने परिणाम
                  </label>
                  <input
                    type="text"
                    value={formData.outcome}
                    onChange={(e) => handleInputChange('outcome', e.target.value)}
                    placeholder="सम्पन्न गर्ने परिणाम"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ईकाइ
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">ईकाइ</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id.toString()}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  कैफियत
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="विस्तृत विवरण..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  रद्द गर्नुहोस्
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (editingProjectId ? 'अपडेट गर्दै...' : 'थप्दै...') : (editingProjectId ? 'अपडेट गर्नुहोस्' : 'थप गर्नुहोस्')}

                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;