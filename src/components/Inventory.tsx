import React, { useState, useEffect } from 'react';
import { Search, Download, Info, Edit, FileText, Copy, Plus, ChevronLeft, ChevronRight, Home, Trash2, Upload } from 'lucide-react';
import axios from 'axios';
import AddCompanyModal from '../modals/AddCompanyModal';
import toast from 'react-hot-toast';
import FileUploadModal from '../modals/FileUploadModal';
import { toNepaliNumber } from '../utils/formatters';

interface InventoryData {
  id: number;
  company_name: string;
  company_registration_number: string;
  pan_number: string;
  tax_clearence: boolean;
  license_copy: boolean;
  inventory_document: string;
  pan_file: string;
  license_file: string;
  tax_clearance_file: string;
  registration_certificate_file: string;
  actions: string[];
}

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [fieldKey, setSelectedFieldKey] = useState(''); // default

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get('http://213.199.53.33:8000/api/inventory/supplier-registry/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventoryData(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleAddSuccess = () => {
    setIsDialogOpen(false);
    fetchInventory();
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredData = inventoryData.filter(item =>
    item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://213.199.53.33:8000/api/inventory/supplier-registry/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInitialFormData(response.data);
      setEditingCompanyId(id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('के तपाईं यो कम्पनी हटाउन निश्चित हुनुहुन्छ?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://213.199.53.33:8000/api/inventory/supplier-registry/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('कम्पनी सफलतापूर्वक हटाइयो');
      fetchInventory(); // Refresh the list
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('हटाउन त्रुटि भयो');
    }
  };

  const renderDocumentCell = (hasDocument: boolean, companyId: number, fieldKey: string) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => {
          setSelectedCompanyId(companyId);
          setSelectedFieldKey(fieldKey); // <-- set the fieldKey here
          setUploadDialogOpen(true);
        }}
        className={`p-1 rounded cursor-pointer ${hasDocument ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
      >
        <Upload className="w-4 h-4" />
      </button>
      <button className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer">
        <Info className="w-4 h-4" />
      </button>
    </div>
  );



  const renderActionCell = (actions: string[], id: number) => (
    <div className="flex items-center space-x-2">
      {actions.includes('edit') && (
        <button
          className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
          onClick={() => handleEditClick(id)}
        >
          <Edit className="w-4 h-4" />
        </button>
      )}
      {actions.includes('copy') && (
        <button className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer">
          <Copy className="w-4 h-4" />
        </button>
      )}
      {actions.includes('file') && (
        <button className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer">
          <FileText className="w-4 h-4" />
        </button>
      )}
      {actions.includes('edit') && (
        <button
          className="p-1 rounded text-red-600 hover:text-red-800 cursor-pointer"
          onClick={() => handleDelete(id)}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );


  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ChevronLeft className="w-4 h-4" />
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>गृहपृष्ठ</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">मौजुदा सूची</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <span className="text-gray-900 font-medium">आर्थिक वर्ष : २०८२/८३</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">मौजुदा सूची</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            <span>नयाँ कम्पनी थप्नुहोस्</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="कम्पनी खोज्नुहोस्"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">क्र.स.</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">कम्पनीको नाम</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">कम्पनी दर्ता</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">प्यान दर्ता</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">कर चुक्ता प्रमाणपत्र</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">इन्जाजत पत्र</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">मौजुदा सूची पत्र</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">अन्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm text-gray-800">{toNepaliNumber(index + 1)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{item.company_name}</td>
                  <td className="py-3 px-4">{renderDocumentCell(!!item.registration_certificate_file, item.id, 'registration_certificate_file')}</td>
                  <td className="py-3 px-4">{renderDocumentCell(!!item.pan_file, item.id, 'pan_file')}</td>
                  <td className="py-3 px-4">{renderDocumentCell(!!item.tax_clearance_file, item.id, 'tax_clearance_file')}</td>
                  <td className="py-3 px-4">{renderDocumentCell(!!item.license_file, item.id, 'license_file')}</td>
                  <td className="py-3 px-4">{renderDocumentCell(!!item.inventory_document, item.id, 'inventory_document')}</td>
                  <td className="py-3 px-4">{renderActionCell(item.actions || ['edit'], item.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">&lt;</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm cursor-pointer">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer">&gt;</button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <AddCompanyModal
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setInitialFormData(null);
            setEditingCompanyId(null);
          }}
          onSuccess={handleAddSuccess}
          initialData={initialFormData}
          companyId={editingCompanyId}
        />
      )}

      {uploadDialogOpen && selectedCompanyId !== null && (
        <FileUploadModal
          open={uploadDialogOpen}
          onClose={() => {
            setUploadDialogOpen(false);
            setSelectedCompanyId(null);
            setSelectedFieldKey('');
            fetchInventory();
          }}
          companyId={selectedCompanyId}
          fieldKey={fieldKey} // <-- pass it here
        />
      )}



    </main>
  );
};

export default Inventory;
