// Utility functions for formatting data

export const getNameById = (arr: any[], id: number | string) => {
  const found = arr.find(item => item.id === id);
  return found ? found.name : 'N/A';
};

export const formatBudget = (budget: number | undefined): string => {
  if (!budget) return 'N/A';
  
  // Convert to Nepali numerals and format
  const formatted = budget.toLocaleString('ne-NP');
  return `रु ${formatted}`;
};

export const toNepaliNumber = (num: number | string): string => {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().split('').map(d => (/\d/.test(d) ? nepaliDigits[+d] : d)).join('');
};

export const formatWardNumber = (wardNo: number | undefined): string => {
  if (!wardNo) return 'N/A';
  
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  const wardStr = wardNo.toString();
  const nepaliWard = wardStr.split('').map(digit => nepaliNumbers[parseInt(digit)]).join('');
  
  return `वडा नं. - ${nepaliWard}`;
};

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'not_started': 'सुरु नभएको',
    'process_ensured': 'सुरुको प्रक्रिया सुनिश्चित भएको',
    'completed': 'सम्पन्न भएको'
  };
  
  return statusMap[status] || status;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'not_started': 'text-red-600',
    'process_ensured': 'text-blue-600',
    'completed': 'text-green-600'
  };
  
  return colorMap[status] || 'text-gray-600';
};