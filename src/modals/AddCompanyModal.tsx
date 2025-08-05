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
        const res = await axios.get<FiscalYear[]>('http://213.199.53.33:8000/api/settings/fiscal-year/',
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
        ...initialData
      }));
    }
  }, [initialData]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

      if (companyId) {
        // Editing mode
        await axios.put(
          `http://213.199.53.33:8000/api/inventory/supplier-registry/${companyId}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('कम्पनी विवरण सफलतापूर्वक सम्पादन गरियो।');
      } else {
        // Adding new
        await axios.post(
          'http://213.199.53.33:8000/api/inventory/supplier-registry/',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('तपाईंको निवेदन सफलतापूर्वक पेश गरियो। धन्यवाद!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting company:', error);
      toast.error('त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };



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