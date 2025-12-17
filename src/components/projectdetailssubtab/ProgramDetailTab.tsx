import React, { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import { formatBudget, formatWardNumber, toNepaliNumber } from '../../utils/formatters';
import BeneficiaryDialog from '../../modals/AddEditYojanaModal';

interface ProgramDetailsTabProps {
  projectData: any;
  loading?: boolean;
}

const ProgramDetailsTab: React.FC<ProgramDetailsTabProps> = ({
  projectData,
  loading = false
}) => {
  // Default beneficiary data matching your image
  const [beneficiaryData, setBeneficiaryData] = useState<any[]>([]);
  const [beneficiaryLoading, setBeneficiaryLoading] = useState(false);

  useEffect(() => {
    if (!projectData || !projectData.serial_number) return;
    setBeneficiaryLoading(true);

    fetch(`http://213.199.53.33:8001/api/projects/${projectData.serial_number}/beneficiaries/`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch beneficiary data');
        return res.json();
      })
      .then((data) => {
        setBeneficiaryData(Array.isArray(data) ? data : []);
        setBeneficiaryLoading(false);
      })
      .catch(() => {
        console.error('लाभान्वित विवरण लोड गर्न असफल भयो।');
        setBeneficiaryLoading(false);
      });
  }, [projectData?.serial_number]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const nepaliLabels: Record<string, string> = {
    total_households: 'जम्मा परिवार',
    total_population: 'जम्मा जनसंख्या',
    indigenous_families: 'आदिवासी जनजातिको परिवार संख्या',
    dalit_families: 'दलित वर्गको परिवार संख्या',
    children_population: 'बालबालिकाको जनसंख्या',
    other_families: 'अन्य वर्गको परिवार संख्या'
  };

  // const handleEditBeneficiary = () => {
  //   const firstItem = beneficiaryData[0]; // or pick specific one
  //   if (firstItem) {
  //     setSelectedBeneficiary({
  //       familyCount: firstItem.familyCount ?? 0,
  //       totalPopulation: {
  //         female: firstItem.female ?? 0,
  //         male: firstItem.male ?? 0,
  //         other: firstItem.other ?? 0
  //       },
  //       indigenousCount: firstItem.indigenousCount ?? 0,
  //       dalitCount: firstItem.dalitCount ?? 0,
  //       childrenPopulation: {
  //         female: firstItem.children_female ?? 0,
  //         male: firstItem.children_male ?? 0,
  //         other: firstItem.children_other ?? 0
  //       },
  //       otherCategoryPopulation: {
  //         female: firstItem.other_female ?? 0,
  //         male: firstItem.other_male ?? 0,
  //         other: firstItem.other_other ?? 0
  //       }
  //     });
  //     setIsDialogOpen(true);
  //   }
  // };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">लोड गर्दै...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Project Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                आयोजनाको नाम:
              </label>
              <p className="text-gray-900 font-semibold text-sm">{projectData.project_name}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                वडा नं:
              </label>
              <p className="text-gray-900 text-sm">{formatWardNumber(projectData.ward_no)}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                विषयगत क्षेत्र:
              </label>
              <p className="text-gray-900 text-sm">{projectData.area_name || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                योजना संचालन स्थल:
              </label>
              <p className="text-gray-900 text-sm">{projectData.location_gps || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                योजनाको स्तर:
              </label>
              <p className="text-gray-900 text-sm">{projectData.project_level_name || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                स्रोत:
              </label>
              <p className="text-gray-900 text-sm">{projectData.source_name || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                आयोजना संचालन हुने आर्थिक वर्ष:
              </label>
              <p className="text-gray-900 text-sm">{toNepaliNumber(projectData.fiscal_year_name) || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                योजना संचालन मिति:
              </label>
              <p className="text-gray-900 text-sm">-</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                अपेक्षित:
              </label>
              <p className="text-gray-900 text-sm">{projectData.status}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                सम्झौता रकम रु.:
              </label>
              <p className="text-gray-900 text-sm">रु. ०.००</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                आर्थिक वर्ष:
              </label>
              <p className="text-gray-900 text-sm">{toNepaliNumber(projectData.fiscal_year_name) || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                उप-क्षेत्र:
              </label>
              <p className="text-gray-900 text-sm">{projectData.sub_area_name || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                खर्च केन्द्र:
              </label>
              <p className="text-gray-900 text-sm">{projectData.expenditure_center_name || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                विनियोजित रकम रु.:
              </label>
              <p className="text-gray-900 text-sm">{toNepaliNumber(formatBudget(projectData.budget))}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                सम्पन्न गर्ने परिणाम:
              </label>
              <p className="text-gray-900 text-sm">{projectData.outcome || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                योजना सुरु मिति:
              </label>
              <p className="text-gray-900 text-sm">-</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                योजना संचालन स्थानको GPS CO-ORDINATE:
              </label>
              <p className="text-gray-900 text-sm">{projectData.location_gps || 'N/A'}</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                योजना समाप्त हुने मिति:
              </label>
              <p className="text-gray-900 text-sm">-</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                लगत अनुमान रु.:
              </label>
              <p className="text-gray-900 text-sm">रु.</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                कन्टेजेन्सी रकम:
              </label>
              <p className="text-gray-900 text-sm">रु.</p>
            </div>

            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700 min-w-[220px]">
                उपभोगिता समितिको खर्च रकम रु.:
              </label>
              <p className="text-gray-900 text-sm">रु. ०.००</p>
            </div>
          </div>
        </div>
      </div>


      {/* Beneficiary Details Table */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            आयोजनाबाट लाभान्वित हुनेको विवरण :
          </h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>इडिट गर्नुहोस्</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r">क्र.स.</th>
                <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r">किसिम</th>
                <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r">महिला</th>
                <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r">पुरुष</th>
                <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700 border-r">अन्य</th>
                <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">जम्मा</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {beneficiaryLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">लोड हुँदै...</td>
                </tr>
              ) : beneficiaryData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">डाटा उपलब्ध छैन।</td>
                </tr>
              ) : (
                beneficiaryData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-center text-gray-700 border-r">{toNepaliNumber(index + 1)}</td>
                    <td className="px-4 py-3 text-sm text-left text-gray-700 border-r">{nepaliLabels[item.title]}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 border-r">{toNepaliNumber(item.female) ?? ''}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 border-r">{toNepaliNumber(item.male) ?? ''}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700 border-r">{toNepaliNumber(item.other) ?? ''}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{toNepaliNumber(item.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {isDialogOpen && (
        <BeneficiaryDialog
          isOpen={isDialogOpen}
          beneficiaryData={beneficiaryData}
          onClose={() => setIsDialogOpen(false)}
          onSave={(updatedData) => {
            setBeneficiaryData(updatedData); // Set new data locally
            setIsDialogOpen(false);
            console.log("Save this to backend:", updatedData); // Save via API if needed
          }}
        />
      )}

    </div>
  );
};

export default ProgramDetailsTab;