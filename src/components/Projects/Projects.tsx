import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSetting';
import { useProjects } from '../../hooks/useProject';
import { projectApi } from '../../services/projectsApi';
import toast from 'react-hot-toast';
import axios from 'axios';

// Import components

import ImportDialog from './ImportDialog';
import ProjectForm from './ProjectForm';
import Pagination from './Pagination';
import ProjectsTable from './ProjectsTable';
import SearchAndFilter from './SearchAndFilter';
import ProjectsHeader from './ProjectHeader';
import ProjectDetail from '../ProjectDetails/ProjectDetail';
import Breadcrumb from '../BreadCrumb';
import Swal from 'sweetalert2';

interface ProjectsProps {
  onProjectSelect?: (projectId: string) => void;
}

interface NewProjectForm {
  project_name: string;
  thematic_area: string;
  sub_area: string;
  project_level: string;
  expenditure_title: string;
  expenditure_center: string;
  budget: string;
  source: string;
  operation_location: string;
  ward_no: number[]; // Changed from string to string[]
  location_gps: string;
  outcome: string;
  unit: string;
  description: string;
  fiscal_year: string;
}

const Projects: React.FC<ProjectsProps> = ({ onProjectSelect }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [formData, setFormData] = useState<NewProjectForm>({
    project_name: '',
    thematic_area: '',
    sub_area: '',
    project_level: '',
    expenditure_title: '',
    expenditure_center: '',
    budget: '',
    source: '',
    operation_location: '',
    ward_no: [], // Initialize as empty array
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
  // Update the formData thematic_area reference in filteredsub_areas
  const filteredsub_areas = sub_areas.filter((sub_area) => {
    if (!formData.thematic_area) return true
    const selectedThematicArea = thematicAreas.find((area) => area.id.toString() === formData.thematic_area)
    return (sub_area as any).thematic_area === selectedThematicArea?.id
  })


  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    totalCount,
    hasNext,
    hasPrevious,
    refetch: refetchProjects,
  } = useProjects({
    page: currentPage,
    search: searchTerm,
  })

  // Event handlers
  const handleEdit = async (id: number) => {
    try {
      const projectToEdit = projects.find(project => project.serial_number === id);
      if (!projectToEdit) {
        console.error('Project not found');
        return;
      }

      setFormData({
        project_name: projectToEdit.project_name || '',
        thematic_area: projectToEdit.area?.toString() || '',
        sub_area: projectToEdit.sub_area?.toString() || '',
        project_level: projectToEdit.project_level?.toString() || '',
        expenditure_title: projectToEdit.expenditure_title?.toString() || '',
        expenditure_center: projectToEdit.expenditure_center?.toString() || '',
        budget: projectToEdit.budget?.toString() || '',
        source: projectToEdit.source?.toString() || '',
        operation_location: projectToEdit.operation_location || '',
        ward_no: Array.isArray(projectToEdit.ward_no)
          ? projectToEdit.ward_no.map(Number) // Convert to array of numbers
          : [Number(projectToEdit.ward_no)], // Handle single value       
        location_gps: projectToEdit.location_gps || '',
        outcome: projectToEdit.outcome || '',
        unit: projectToEdit.unit?.toString() || '',
        description: projectToEdit.description || '',
        fiscal_year: projectToEdit.fiscal_year?.toString() || ''
      });

      setIsDialogOpen(true);
      setEditingProjectId(projectToEdit.serial_number);
    } catch (error) {
      console.error('Error preparing edit:', error);
      toast.error('परियोजना सम्पादन गर्न सकिएन');
    }
  };

   // Handle search input change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'के तपाईं यो परियोजना मेटाउन चाहनुहुन्छ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'हो',
      cancelButtonText: 'होइन',
    });

    if (result.isConfirmed) {
      try {
        await projectApi.delete(id);
        refetchProjects();
        toast.success('परियोजना सफलतापूर्वक मेटाइयो');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('परियोजना मेटाउन सकिएन');
      }
    }
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
      if (field === 'thematic_area') {
        newData.sub_area = '';
      }
      return newData;
    });
  };

  const handleWardNoChange = (selectedWards: number[]) => {
    setFormData(prev => ({ ...prev, ward_no: selectedWards }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        project_name: formData.project_name,
        area: formData.thematic_area ? parseInt(formData.thematic_area) : undefined,
        sub_area: formData.sub_area ? parseInt(formData.sub_area) : undefined,
        project_level: formData.project_level ? parseInt(formData.project_level) : undefined,
        expenditure_title: formData.expenditure_title ? parseInt(formData.expenditure_title) : undefined,
        expenditure_center: formData.expenditure_center ? parseInt(formData.expenditure_center) : undefined,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        source: formData.source ? parseInt(formData.source) : undefined,
        operation_location: formData.operation_location,
        ward_no: formData.ward_no, // Already numbers, no conversion needed
        location_gps: formData.location_gps,
        outcome: formData.outcome,
        unit: formData.unit ? parseInt(formData.unit) : undefined,
        description: formData.description,
        fiscal_year: formData.fiscal_year ? parseInt(formData.fiscal_year) : undefined,
        status: 'not_started',
      };


      if (editingProjectId) {
        await projectApi.update(editingProjectId, submitData);
        toast.success('Project updated successfully');
      } else {
        await projectApi.create(submitData);
        console.log('Project added successfully');
      }

      handleCancel();
      refetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(editingProjectId ? 'परियोजना अपडेट गर्न सकिएन' : 'परियोजना थप्न सकिएन');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setFormData({
      project_name: '',
      thematic_area: '',
      sub_area: '',
      project_level: '',
      expenditure_title: '',
      expenditure_center: '',
      budget: '',
      source: '',
      operation_location: '',
      ward_no: [], // Initialize as empty array
      location_gps: '',
      outcome: '',
      unit: '',
      description: '',
      fiscal_year: ''
    });
    setEditingProjectId(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error('कृपया Excel फाइल मात्र छान्नुहोस् (.xlsx वा .xls)');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('कृपया पहिले फाइल छान्नुहोस्');
      return;
    }

    setIsImporting(true);
    const token = localStorage.getItem('access_token');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post(
        'http://43.205.239.123/api/projects/projects/import_excel/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      toast.success('Excel फाइल सफलतापूर्वक आयात भयो');
      setIsImportDialogOpen(false);
      setSelectedFile(null);
      refetchProjects();
    } catch (error: any) {
      console.error('Import error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Excel फाइल आयात गर्न सकिएन';
      toast.error(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.get(
        'http://43.205.239.123/api/projects/projects/export/',
        {
          responseType: 'blob',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const currentDate = new Date().toISOString().split('T')[0];
      link.download = `परियोजनाहरू_${currentDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Excel फाइल सफलतापूर्वक डाउनलोड भयो');
    } catch (error: any) {
      console.error('Export error:', error);
      const errorMessage = error.response?.data?.message || 'Excel फाइल निर्यात गर्न सकिएन';
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportCancel = () => {
    setIsImportDialogOpen(false);
    setSelectedFile(null);
  };

  // Render project detail if selected
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
        <Breadcrumb />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ProjectsHeader
            onAddProject={() => setIsDialogOpen(true)}
            onImport={() => setIsImportDialogOpen(true)}
            onExport={handleExport}
            isExporting={isExporting}
          />

          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />

          {/* Error Message */}
          {projectsError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">त्रुटि: {projectsError}</p>
            </div>
          )}

          <ProjectsTable
            projects={projects}
            loading={projectsLoading}
            currentPage={currentPage}
            thematicAreas={thematicAreas}
            sub_areas={sub_areas}
            sources={sources}
            expenditureCenters={expenditureCenters}
            onProjectClick={handleProjectClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <ProjectForm
        isOpen={isDialogOpen}
        formData={formData}
        isSubmitting={isSubmitting}
        editingProjectId={editingProjectId}
        thematicAreas={thematicAreas}
        sub_areas={sub_areas}
        projectLevels={projectLevels}
        expenditureTitles={expenditureTitles}
        expenditureCenters={expenditureCenters}
        sources={sources}
        units={units}
        fiscalYears={fiscalYears}
        wardOptions={wardOptions}
        filteredsub_areas={filteredsub_areas}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onWardNoChange={handleWardNoChange}
      />

      <ImportDialog
        isOpen={isImportDialogOpen}
        selectedFile={selectedFile}
        isImporting={isImporting}
        onFileSelect={handleFileSelect}
        onImport={handleImport}
        onCancel={handleImportCancel}
      />
    </>
  );
};

export default Projects;