import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Plus, Edit, Trash2 } from 'lucide-react';
import { type SettingsItem } from '../types/settings';
import { settingsApi } from '../services/settingsApi';
import AddEditModal from '../modals/AddEditModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import toast, { Toaster } from 'react-hot-toast';
import { toNepaliNumber } from '../utils/formatters';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('विषयगत क्षेत्र');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<SettingsItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SettingsItem | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const tabs = [
    'विषयगत क्षेत्र',
    'उप-क्षेत्र',
    'समुह',
    'योजनाको स्तर',
    'खर्च शिर्षक',
    'खर्च केन्द्र',
    'स्रोत',
    'इकाई',
    'नगर गौरव योजनाको शिर्षक',
    'आर्थिक वर्ष',
    'बैंकहरू',
    'नमुनाहरु'
  ];

  // Load data when tab changes
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await settingsApi.getAll(activeTab);
      console.log('Loaded data for', activeTab, ':', result);
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('डाटा लोड गर्न सकिएन');
      setData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    const searchFields = [
      item.name?.toLowerCase() || '',
      (item as any).committee_name?.toLowerCase() || '', // Changed from 'committee'
      (item as any).code?.toLowerCase() || '',
      (item as any).title?.toLowerCase() || ''
    ];
    return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
  });

  // CRUD Operations
  const handleAdd = () => {
    setSelectedItem(null);
    setModalMode('add');
    setAddEditModalOpen(true);
  };

  const handleEdit = (item: SettingsItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setAddEditModalOpen(true);
  };

  const handleDelete = (item: SettingsItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleSave = async (formData: Partial<SettingsItem>) => {
    try {
      if (modalMode === 'add') {
        await settingsApi.create(activeTab, formData);
        toast.success('सफलतापूर्वक थपियो');
      } else if (selectedItem) {
        await settingsApi.update(activeTab, selectedItem.id, formData);
        toast.success('सफलतापूर्वक अपडेट भयो');
      }
      setAddEditModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('सेभ गर्न सकिएन');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      await settingsApi.delete(activeTab, selectedItem.id);
      toast.success('सफलतापूर्वक मेटाइयो');
      setDeleteModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('मेटाउन सकिएन');
    }
  };

  const handleToggleStatus = async (item: SettingsItem) => {
    try {
      await settingsApi.toggleStatus(activeTab, item.id, !item.is_active); // Changed from 'status' to 'is_active'
      toast.success('स्थिति परिवर्तन भयो');
      loadData();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('स्थिति परिवर्तन गर्न सकिएन');
    }
  };

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center cursor-pointer rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  const renderTableHeaders = () => {
    switch (activeTab) {
      case 'विषयगत क्षेत्र':
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">विषयगत क्षेत्रको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">विषयगत समिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
      case 'उप-क्षेत्र':
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">विषयगत क्षेत्रको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">उप-क्षेत्रको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
      case 'समुह':
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">विषयगत क्षेत्रको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">उप-क्षेत्रको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">समूहको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
      case 'इकाई':
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">इकाइको नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">इकाइको संक्षिप्त नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
      case 'आर्थिक वर्ष':
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">आर्थिक वर्ष</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
      case 'नमुनाहरु':
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">कोड</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">शिर्षक</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
      default:
        return (
          <>
            <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">नाम</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
          </>
        );
    }
  };

  const renderTableRow = (item: SettingsItem, index: number) => {
    const typedItem = item as any;

    switch (activeTab) {
      case 'विषयगत क्षेत्र':
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{item.name}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.committee_name || '-'}</td>
            <td className="py-3 px-4">
              <ToggleSwitch
                enabled={item.is_active} // Changed from 'status' to 'is_active'
                onChange={() => handleToggleStatus(item)}
              />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );
      case 'उप-क्षेत्र':
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.thematic_area_name || '-'}</td>
            <td className="py-3 px-4 text-gray-900">{item.name}</td>
            <td className="py-3 px-4">
              <ToggleSwitch
                enabled={item.is_active}
                onChange={() => handleToggleStatus(item)}
              />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );
      case 'समुह':
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.thematic_area_details.name || '-'}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.sub_area_details.name || '-'}</td>
            <td className="py-3 px-4 text-gray-900">{item.name}</td>
            <td className="py-3 px-4">
              <ToggleSwitch
                enabled={item.is_active}
                onChange={() => handleToggleStatus(item)}
              />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800  cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );
      case 'इकाई':
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{item.name}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.short_name || '-'}</td>
            <td className="py-3 px-4">
              <ToggleSwitch
                enabled={item.is_active}
                onChange={() => handleToggleStatus(item)}
              />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800  cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800  cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );

      case 'आर्थिक वर्ष':
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.year)}</td>
            <td className="py-3 px-4">
              <ToggleSwitch
                enabled={item.is_active}
                onChange={() => handleToggleStatus(item)}
              />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800  cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800  cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );
      case 'नमुनाहरु':
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.code || '-'}</td>
            <td className="py-3 px-4 text-gray-900">{typedItem.title || item.name}</td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800  cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800  cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );
      default:
        return (
          <>
            <td className="py-3 px-4 text-gray-900">{toNepaliNumber(index + 1)}</td>
            <td className="py-3 px-4 text-gray-900">{item.name}</td>
            <td className="py-3 px-4">
              <ToggleSwitch
                enabled={item.is_active}
                onChange={() => handleToggleStatus(item)}
              />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <ChevronLeft className="w-4 h-4" />
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>गृहपृष्ठ</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">सेटिंग्स</span>
            </div>
          </div>

          {/* Settings Navigation */}
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer ${activeTab === tab
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">सेटिंग्स</h1>
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>नयाँ प्रविष्टि</span>
            </button>
          </div>

          {/* Current Tab Title */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg inline-block">
              {activeTab}
            </h2>
          </div>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder={`${activeTab} खोज्नुहोस्`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {renderTableHeaders()}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">लोड गर्दै...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-lg font-medium">कुनै डाटा फेला परेन</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {renderTableRow(item, index)}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                कुल: {filteredData.length} वटा
              </span>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddEditModal
          open={addEditModalOpen}
          onClose={() => setAddEditModalOpen(false)}
          onSave={handleSave}
          item={selectedItem}
          activeTab={activeTab}
          mode={modalMode}
        />

        <DeleteConfirmModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selectedItem?.name || ''}
        />
      </main>
    </div>
  );
};

export default Settings;