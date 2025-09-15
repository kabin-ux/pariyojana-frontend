import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { toNepaliNumber } from '../utils/formatters';

interface AddCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<FormData> | null;
  companyId?: number | null;
}

interface FiscalYear {
  id: number;
  year: string;
  is_active: boolean;
}

interface FormData {
  company_name: string;
  address: string;
  correspondence_address: string;
  contact_person: string;
  email: string;
  mobile_number: string;
  telephone_number: string;
  company_registration_number: string;
  pan_number: string;
  registration_certificate_file?: File | string | null;
  license_file?: File | string | null;
  tax_clearance_file?: File | string | null;
  pan_file?: File | string | null;
  existing_inventory_list?: File | string | null;
  has_registration_certificate: boolean,
  is_renewed: boolean,
  has_vat_pan_certificate: boolean,
  has_tax_clearance: boolean,
  has_license_copy: boolean,
  goods_description: string;
  construction_description: string;
  consulting_description: string;
  other_services_description: string;
  fiscal_year: string;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ open, onClose, onSuccess, initialData, companyId }) => {
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    address: '',
    correspondence_address: '',
    contact_person: '',
    email: '',
    mobile_number: '',
    telephone_number: '',
    company_registration_number: '',
    pan_number: '',
    has_registration_certificate: false,
    is_renewed: false,
    has_vat_pan_certificate: false,
    has_tax_clearance: false,
    has_license_copy: false,
    goods_description: '',
    construction_description: '',
    consulting_description: '',
    other_services_description: '',
    fiscal_year: ''
  });

  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);

  useEffect(() => {
    const fetchFiscalYears = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const res = await axios.get<FiscalYear[]>('http://www.bardagoriyapms.com/api/settings/fiscal-year/',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFiscalYears(res.data);
      } catch (error) {
        console.error('Error fetching fiscal years:', error);
      }
    };

    fetchFiscalYears();
  }, []);
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        // Convert string dates to proper format if needed
        fiscal_year: initialData.fiscal_year || '',
        // Handle boolean fields
        has_registration_certificate: initialData.has_registration_certificate || false,
        is_renewed: initialData.is_renewed || false,
        has_vat_pan_certificate: initialData.has_vat_pan_certificate || false,
        has_tax_clearance: initialData.has_tax_clearance || false,
        has_license_copy: initialData.has_license_copy || false
      }));
    } else {
      // Reset form when adding new
      setFormData({
        company_name: '',
        address: '',
        correspondence_address: '',
        contact_person: '',
        email: '',
        mobile_number: '',
        telephone_number: '',
        company_registration_number: '',
        pan_number: '',
        has_registration_certificate: false,
        is_renewed: false,
        has_vat_pan_certificate: false,
        has_tax_clearance: false,
        has_license_copy: false,
        registration_certificate_file: null,
        license_file: null,
        tax_clearance_file: null,
        pan_file: null,
        existing_inventory_list: null,
        goods_description: '',
        construction_description: '',
        consulting_description: '',
        other_services_description: '',
        fiscal_year: ''
      });
    }
  }, [initialData]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: e.target.files![0]
      }));
    }
  };

  const handleRemoveFile = (fieldName: keyof FormData) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  const handleRadioChange = (name: keyof FormData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    onClose();

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');
      const formDataToSend = new FormData();

      // Append all non-file fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key.endsWith('_file') || key === 'existing_inventory_list') return;
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });
      // Handle file fields conditionally
      const fileFieldMappings = [
        { field: 'registration_certificate_file', enabled: formData.has_registration_certificate },
        { field: 'license_file', enabled: formData.has_license_copy },
        { field: 'tax_clearance_file', enabled: formData.has_tax_clearance },
        { field: 'pan_file', enabled: formData.has_vat_pan_certificate },
        { field: 'existing_inventory_list', enabled: true } // Always required
      ];

      fileFieldMappings.forEach(({ field, enabled }) => {
        if (!enabled) return;

        const value = formData[field as keyof FormData];

        if (value instanceof File) {
          formDataToSend.append(field, value);
        } else if (value === null) {
          formDataToSend.append(field, ''); // Clear existing file
        } else if (typeof value === 'string' && value.startsWith('http')) {
          // Keep existing file - don't append anything
        }
      });

      // 3. Include ID for edits
      if (companyId) {
        formDataToSend.append('id', companyId.toString());
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': localStorage.getItem('csrftoken') || ''
        }
      };

      // 4. Determine API endpoint and method
      const url = companyId
        ? `http://www.bardagoriyapms.com/api/inventory/supplier-registry/${companyId}/`
        : 'http://www.bardagoriyapms.com/api/inventory/supplier-registry/';

      const method = companyId ? 'patch' : 'post';

      // 5. Make the API call
      await axios[method](url, formDataToSend, config);

      toast.success(companyId
        ? 'कम्पनी विवरण सफलतापूर्वक सम्पादन गरियो।'
        : 'तपाईंको निवेदन सफलतापूर्वक पेश गरियो। धन्यवाद!');

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error submitting company:', error);
      const errorMsg = error.response?.data?.registration_certificate_file?.[0] ||
        error.response?.data?.detail ||
        'त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।';
      toast.error(errorMsg);
    }
  };


  const renderFileInput = (field: {
    key: string;
    label: string;
    required: boolean;
    currentFile: string | null;
    enabled: boolean; // New prop to control enabled state
  }) => (
    <div key={field.key} className="space-y-2">
      <label className={`block text-sm font-medium ${field.enabled ? 'text-gray-700' : 'text-gray-400'}`}>
        {field.label} {field.required && field.enabled && <span className="text-red-500">*</span>}
      </label>

      {!field.enabled ? (
        <div className="text-sm text-gray-500 italic">
          यो फिल्ड सक्रिय गर्न उपरको चेकबक्स चयन गर्नुहोस्
        </div>
      ) : field.currentFile ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-600 truncate">
            {field.currentFile.split('/').pop()}
          </span>
          <button
            type="button"
            onClick={() => handleRemoveFile(field.key as keyof FormData)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            हटाउनुहोस्
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="file"
            onChange={(e) => handleFileChange(e, field.key as keyof FormData)}
            className={`block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              ${field.enabled ? 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100' : 'file:bg-gray-100 file:text-gray-500'}
              ${!field.enabled ? 'cursor-not-allowed' : ''}`}
            required={field.required}
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={!field.enabled}
          />
          <p className="text-xs text-gray-500">PDF, JPG, PNG मात्र स्वीकार्य</p>
        </div>
      )}
    </div>
  );
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-xl flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold text-gray-800">मतदाता सूची</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Fiscal Year Selection */}
          <div className="mb-6 flex justify-end">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">आर्थिक वर्ष:</label>
              <select
                name="fiscal_year"
                value={formData.fiscal_year}
                onChange={handleInputChange}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">आर्थिक वर्ष छान्नुहोस्</option>
                {fiscalYears.map((year) => (
                  <option key={year.id} value={year.year}>
                    {toNepaliNumber(year.year)}
                  </option>
                ))}
              </select>

            </div>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">
                १. मतदाता सूचीको लागि निवेदन दिने व्यक्ति, संस्था, आपूर्तिकर्ता, निर्माण व्यवसायी, परामर्शदाता वा सेवा प्रदायकको विवरण :
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (क) संस्थाको नाम <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="संस्थाको नाम लेख्नुहोस्"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (ख) ठेगाना <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="ठेगाना"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (ग) पत्राचार गर्ने ठेगाना
                  </label>
                  <input
                    type="text"
                    name="correspondence_address"
                    value={formData.correspondence_address}
                    onChange={handleInputChange}
                    placeholder="पत्राचार गर्ने ठेगाना"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (घ) मुख्य व्यक्तिको नाम
                  </label>
                  <input
                    type="text"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    placeholder="मुख्य व्यक्तिको नाम"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (ङ) इमेल <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="इमेल"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (च) मोबाइल नं. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    placeholder="मोबाइल नं."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (छ) टेलिफोन नं.
                  </label>
                  <input
                    type="tel"
                    name="telephone_number"
                    value={formData.telephone_number}
                    onChange={handleInputChange}
                    placeholder="टेलिफोन नं."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (ज) कम्पनी दर्ता नम्बर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_registration_number"
                    value={formData.company_registration_number}
                    onChange={handleInputChange}
                    placeholder="कम्पनी दर्ता नम्बर"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (झ) प्यान दर्ता नम्बर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleInputChange}
                    placeholder="प्यान दर्ता नम्बर"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">
                २. मतदाता सूचीमा दर्ता हुनको लागि निम्नलिखितको प्रमाणपत्र संलग्न गर्नुहोला ।
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'has_registration_certificate', label: '(क) संस्था वा फर्म दर्ताको प्रमाणपत्र' },
                  { key: 'is_renewed', label: '(ख) नविकरण गरिएको' },
                  { key: 'has_vat_pan_certificate', label: '(ग) मूल्य अभिवृद्धि कर वा स्थायी लेखा नम्बर दर्ताको प्रमाणपत्र' },
                  { key: 'has_tax_clearance', label: '(घ) कर चुक्ताको प्रमाणपत्र' }
                ].map((cert) => (
                  <div key={cert.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {cert.label} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={cert.key}
                          checked={formData[cert.key as keyof FormData] === true}
                          onChange={() => handleRadioChange(cert.key as keyof FormData, true)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">छ</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={cert.key}
                          checked={formData[cert.key as keyof FormData] === false}
                          onChange={() => handleRadioChange(cert.key as keyof FormData, false)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">छैन</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  (ङ) कुन खारेजको लागि मतदाता सूचीमा दर्ता हुन निवेदन दिने हो, सो कामको लागि इजाजत पत्र आवश्यक पर्ने प्रमाण सो को प्रतिलिपि
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="has_license_copy"
                      checked={formData.has_license_copy === true}
                      onChange={() => handleRadioChange('has_license_copy', true)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">छ</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="has_license_copy"
                      checked={formData.has_license_copy === false}
                      onChange={() => handleRadioChange('has_license_copy', false)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-sm text-gray-700">छैन</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">
                ३. सार्वजनिक निकायबाट हुने खरिदको लागि दर्ता हुन चाहेको खरिदको प्रकृतिको विवरण:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (क) मालसामान आपूर्ति (मालसामानको प्रकृति उल्लेख गर्ने)
                  </label>
                  <textarea
                    name="goods_description"
                    value={formData.goods_description}
                    onChange={handleInputChange}
                    placeholder="मालसामानको प्रकृति विस्तारमा लेख्नुहोस्"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (ख) निर्माण कार्य
                  </label>
                  <textarea
                    name="construction_description"
                    value={formData.construction_description}
                    onChange={handleInputChange}
                    placeholder="निर्माण कार्यको विवरण"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (ग) परामर्श सेवा (परामर्श सेवाको प्रकृति उल्लेख गर्ने)
                  </label>
                  <textarea
                    name="consulting_description"
                    value={formData.consulting_description}
                    onChange={handleInputChange}
                    placeholder="परामर्श सेवाको प्रकृति विस्तारमा लेख्नुहोस्"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    (घ) अन्य सेवा (अन्य सेवाको प्रकृति उल्लेख गर्ने)
                  </label>
                  <textarea
                    name="other_services_description"
                    value={formData.other_services_description}
                    onChange={handleInputChange}
                    placeholder="अन्य सेवाको प्रकृति विस्तारमा लेख्नुहोस्"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2">
                प्रमाणपत्रहरू अपलोड गर्नुहोस्
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFileInput({
                  key: 'registration_certificate_file',
                  label: 'संस्था वा फर्म दर्ताको प्रमाणपत्र',
                  required: formData.has_registration_certificate,
                  currentFile: typeof formData.registration_certificate_file === 'string' ?
                    formData.registration_certificate_file : null,
                  enabled: formData.has_registration_certificate
                })}

                {renderFileInput({
                  key: 'license_file',
                  label: 'इजाजत पत्रको प्रतिलिपि',
                  required: formData.has_license_copy,
                  currentFile: typeof formData.license_file === 'string' ?
                    formData.license_file : null,
                  enabled: formData.has_license_copy
                })}

                {renderFileInput({
                  key: 'tax_clearance_file',
                  label: 'कर चुक्ताको प्रमाणपत्र',
                  required: formData.has_tax_clearance,
                  currentFile: typeof formData.tax_clearance_file === 'string' ?
                    formData.tax_clearance_file : null,
                  enabled: formData.has_tax_clearance
                })}

                {renderFileInput({
                  key: 'pan_file',
                  label: 'प्यान दर्ताको प्रमाणपत्र',
                  required: formData.has_vat_pan_certificate,
                  currentFile: typeof formData.pan_file === 'string' ?
                    formData.pan_file : null,
                  enabled: formData.has_vat_pan_certificate
                })}

                {renderFileInput({
                  key: 'existing_inventory_list',
                  label: 'वर्तमान सूची',
                  required: formData.is_renewed,
                  currentFile: typeof formData.existing_inventory_list === 'string' ?
                    formData.existing_inventory_list : null,
                  enabled: formData.is_renewed // Always enabled as it's required
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl flex justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            सेभ गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;