import { SubjectCommitteeTableRow } from './SubjectCommitteeTableRow';

interface SubjectCommitteeTableProps {
  activeTab: string;
  data: any[];
  onPrioritizeThematicWard: (id: number) => void;
  onPrioritize: (id: number) => void;
  onRecommend: (id: number) => void;
}

export const SubjectCommitteeTable = ({ activeTab, data, onPrioritizeThematicWard, onPrioritize, onRecommend }: SubjectCommitteeTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-medium text-gray-900">क्र.स</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">योजना तथा कार्यक्रम</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">क्षेत्र</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">उप-क्षेत्र</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">स्रोत</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">खर्च केन्द्र</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">बजेट</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">वडा नं.</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">स्थिति</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">प्राथमिकता नम्बर</th>
          <th className="text-left py-3 px-4 font-medium text-gray-900">अन्य</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <SubjectCommitteeTableRow
              key={item.id}
              item={item}
              index={index}
              activeTab={activeTab}
              onPrioritizeThematicWard={onPrioritizeThematicWard}
              onPrioritize={onPrioritize}
              onRecommend={onRecommend}
            />
          ))
        ) : (
          <tr>
            <td colSpan={11} className="py-12 text-center text-gray-500">
              हाल कुनै योजना फेला परेन।
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);