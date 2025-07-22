import React, { useState } from 'react';
import { Edit, Upload, FileCheck } from 'lucide-react';
import { toNepaliNumber, formatBudget } from '../../utils/formatters';
import ProjectAgreementModal from '../../modals/ProjectAgreementModal';
import EmptyState from './EmptyState';
import * as BS from 'bikram-sambat-js';

interface ProjectAgreementTabProps {
  project: any;
  projectAgreementDetails: any[];
  onAddProjectAgreement: (data: any) => void;
  onDownloadProjectAgreement: (itemSerialNo: number, projectSerialNo: number) => void;
  onDownloadProjectAgreementAndWorkLoad: (itemSerialNo: number, projectSerialNo: number) => void;
}

const PROJECT_AGREEMENT_TITLES = [
  { "serial_no": 1, "title": "उपभोक्ता समिति बैठक र निर्णय", "description": "(खाता संन्चलन,योजना सम्झौता एवं अन्य अख्तियारी सम्बन्ध्मा)" },
  { "serial_no": 2, "title": "उपभोक्ता समितिले सम्झौता सिफारिसका लागी वडामा दिने निवेदन", "description": "(वडाबाट महानगरपालिकामा सिफारिस गरिदिन)" },
  { "serial_no": 3, "title": "योजना संचालन स्थलको फोटो - ४ प्रति", "description": "(कामगर्नु पुर्वको फोटो)" },
  { "serial_no": 4, "title": "नयाँ बैंक खाता सञ्चालन सिफारिस का लागि उपभोक्ता समितिले पेस गर्ने निवेदन" },
  { "serial_no": 5, "title": "वडा कार्यलयले महानगरपालिकालाई सम्झौताका लागी दिने सिफारिस", "description": "(नोट: वडाबाट सम्झौता हुने योजनालाई आवश्यक नभएको )" },
  { "serial_no": 6, "title": "उपभोक्ता सम्झौता सम्बन्धी टिप्पणी (उपभोक्ता समितिसँग सम्झौता गर्न सिफारिस सम्बन्धी टिप्पणी)" },
  { "serial_no": 7, "title": "उपभोक्ता समितिलाई कार्यादेश दिने सम्बन्धी टिप्पणी वा निर्णय" }
];

const PROJECT_AGREEMENT_WORK_TITLES = [
  { "serial_no": 1, "title": "योजना सम्झौता टिप्पणी र आदेश" },
  { "serial_no": 2, "title": "योजना/कार्यक्रम सम्झौताको लागि सम्झौता फाराम" },
  { "serial_no": 3, "title": "आयोजना सन्चालन कार्यादेश" },
  { "serial_no": 4, "title": "आयोजना सूचना पाटी को नमुना" },
];

const ProjectAgreementTab: React.FC<ProjectAgreementTabProps> = ({
  project,
  projectAgreementDetails,
  onAddProjectAgreement,
  onDownloadProjectAgreement,
  onDownloadProjectAgreementAndWorkLoad
}) => {
  const [isProjectAgreementModalOpen, setIsProjectAgreementModalOpen] = useState(false);

  const today = new Date();
  const bsDate = BS.ADToBS(today);
  const agreementDetail = projectAgreementDetails[0];

  return (
    <div className="space-y-8">
      {/* Project Agreement Recommendation and Others */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना सम्झौता सिफारिस तथा अन्य</h3>
        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-800">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 font-semibold text-gray-900">क्र.स.</th>
                <th className="py-3 px-4 font-semibold text-gray-900">शीर्षक</th>
                <th className="py-3 px-4 font-semibold text-gray-900">मिति</th>
                <th className="py-3 px-4 font-semibold text-gray-900">स्थिति</th>
                <th className="py-3 px-4 font-semibold text-gray-900">कार्य</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {PROJECT_AGREEMENT_TITLES.map((item) => (
                <tr
                  key={item.serial_no}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="py-3 px-4">{toNepaliNumber(item.serial_no)}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </td>
                  <td className="py-3 px-4">{toNepaliNumber(bsDate)}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                      उपलब्ध छैन
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => console.log("Upload clicked")}
                        className="p-1 text-blue-600 hover:text-blue-800 transition cursor-pointer"
                        title="Upload"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownloadProjectAgreement(item.serial_no, project.serial_number)}
                        className="p-1 text-green-600 hover:text-green-800 transition cursor-pointer"
                        title="Download PDF"
                      >
                        <FileCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Agreement Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">योजना सम्झौता विवरण</h3>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsProjectAgreementModalOpen(true)}
          >
            <Edit className="w-4 h-4" />
            <span>{agreementDetail ? 'इडिट गर्नुहोस्' : 'थप गर्नुहोस्'}</span>
          </button>
        </div>
        {!agreementDetail ? (
          <EmptyState message="योजना सम्झौता विवरण उपलब्ध छैन।" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">स्वीकृत लागत अनुमान:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.cost_estimate))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी प्रतिशत:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.contingency_percentage) || '0'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कन्टिन्जेन्सी रकम:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.contingency_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कुल लागत अनुमान:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.total_cost_estimate))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">सम्झौता रकम:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.agreement_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">सम्झौता मिति:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.agreement_date) || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">नगरपालिकाले ब्यहेर्ने रकम रु:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.municipality_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">नगरपालिकाले ब्यहेर्ने रकमको प्रतिशत:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.municipality_percentage) || 'N/A'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">जनसहभागिता रकम:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.public_participation_amount))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">जनसहभागिताले ब्यहेर्ने रकमको प्रतिशत:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.public_participation_percentage) || 'N/A'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कार्यादेश मिति:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(formatBudget(agreementDetail.work_order_date))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">कार्य सम्पन्न गर्नुपर्ने मिति:</p>
              <p className="text-lg font-semibold">{toNepaliNumber(agreementDetail.completion_date) || 'N/A'}</p>
            </div>
          </div>
        )}

        {isProjectAgreementModalOpen && (
          <ProjectAgreementModal
            onClose={() => setIsProjectAgreementModalOpen(false)}
            onSave={onAddProjectAgreement}
            agreementData={agreementDetail}
            projectId={project.serial_number}
          />
        )}
      </div>

      {/* Project Agreement and Work Order */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">योजना सम्झौता तथा कार्यादेश</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स.</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">शीर्षक</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">मिति</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
              </tr>
            </thead>
            <tbody>
              {PROJECT_AGREEMENT_WORK_TITLES.map((item) => (
                <tr key={item.serial_no} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{toNepaliNumber(item.serial_no)}</td>
                  <td className="py-3 px-4 text-gray-900 text-sm">
                    <div>{item.title}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-900 text-sm">{toNepaliNumber(bsDate)}</td>
                  <td className="py-3 px-4 text-gray-900 text-sm"></td>
                  <td className="py-3 px-4 text-gray-900 text-sm flex space-x-2">
                    <button
                      type="button"
                      className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => console.log("Upload clicked")}
                    >
                      <Upload className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      className="p-1 rounded text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => onDownloadProjectAgreementAndWorkLoad(item.serial_no, project.serial_number)}
                    >
                      <FileCheck className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectAgreementTab;