
// interface Project {
//   id: number;
//   plan_name: string;
//   thematic_area: string;
//   sub_area: string;
//   source: string;
//   expenditure_center: string;
//   budget: string;
//   ward_no: string;
//   status: string;
//   priority_no: number;
// }

import { formatWardNumber } from "../../utils/formatters";

interface MunicipalOfficeTableProps {
  activeTab: string;
  data: any[];
  onRecommend: (id: number) => void;
}

// Correct typing for React components
interface IconProps {
  className?: string;
}

const FileIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
  </svg>
);

const NoFilesIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4z" />
  </svg>
);

const MunicipalOfficeTable: React.FC<MunicipalOfficeTableProps> = ({ activeTab, data, onRecommend }) => {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                'क्र.स',
                'योजना तथा कार्यक्रम',
                'क्षेत्र',
                'उप-क्षेत्र',
                'स्रोत',
                'खर्च केन्द्र',
                'बजेट',
                'वडा नं.',
                'स्थिति',
                'प्रतिवेदनहरु',
                'अन्य',

              ].map((header, idx) => (
                <th
                  key={idx}
                  className="text-left px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 ? (
              data?.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{item?.id}</td>
                  <td className="py-3 px-4 text-gray-900">{item?.plan_name}</td>
                  <td className="py-3 px-4 text-gray-900">{item?.thematic_area?.name}</td>
                  <td className="py-3 px-4 text-gray-900">{item?.sub_area.name}</td>
                  <td className="py-3 px-4 text-gray-900">{item?.source.name}</td>
                  <td className="py-3 px-4 text-gray-900">{item?.expenditure_center.name}</td>
                  <td className="py-3 px-4 text-gray-900">रु {item?.budget}</td>
                  <td className="py-3 px-4 text-gray-900">{formatWardNumber(item?.ward_no)}</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {item?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm space-y-2">
                    {item.feasibility_file && (
                      <a
                        href={item.feasibility_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
                        title="सम्भाव्यता अध्ययन"
                      >
                        <FileIcon className="w-3.5 h-3.5" />
                        सम्भाव्यता अध्ययन
                      </a>
                    )}

                    {item.detailed_file && (
                      <a
                        href={item.detailed_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 hover:border-green-300 transition-all duration-200 hover:shadow-sm"
                        title="विस्तृत अध्ययन"
                      >
                        <FileIcon className="w-3.5 h-3.5" />
                        विस्तृत अध्ययन
                      </a>
                    )}

                    {item.environmental_file && (
                      <a
                        href={item.environmental_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-sm"
                        title="वातावरणीय अध्ययन"
                      >
                        <FileIcon className="w-3.5 h-3.5" />
                        वातावरणीय अध्ययन
                      </a>
                    )}

                    {!item.feasibility_file &&
                      !item.detailed_file &&
                      !item.environmental_file && (
                        <div className="flex items-center justify-center h-8 text-gray-400 text-xs">
                          <NoFilesIcon className="w-4 h-4 mr-1" />
                          कुनै फाइल छैन
                        </div>
                      )}
                  </td>

                  <td className="py-3 px-4">
                    {activeTab === 'नगर सभामा पेश गर्नु अघिको परियोजना' && (
                      <button
                        onClick={() => onRecommend(item.id)}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 cursor-pointer"
                      >
                        नगर सभामा पेश गर्नुहोस्
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <NoDataRow />
            )}
          </tbody>
        </table>
      </div>
      <Pagination />
    </>
  );
};


const NoDataRow = () => (
  <tr>
    <td colSpan={11} className="py-12 text-center">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium">No data</p>
      </div>
    </td>
  </tr>
);

const Pagination = () => (
  <div className="flex items-center justify-center mt-6">
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">1</span>
    </div>
  </div>
);

export default MunicipalOfficeTable;