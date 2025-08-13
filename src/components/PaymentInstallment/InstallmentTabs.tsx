import React from 'react';
import PaymentDetailsSection from './PaymentDetailsSection';
import BankDetailsSection from './BankDetailsSection';
import InstallmentSection from './InstallmentSection';

const tabs = [
    'बैंकको विवरण',
    'पहिलो पेस्की भुक्तानी',
    'दोस्रो किस्ता भुक्तानी',
    'अन्तिम किस्ता भुक्तानी',
    'भुक्तानी विवरण'
];

const InstallmentTabs: React.FC<{
    activeTab: string;
    setActiveTab: (tab: string) => void;
    project: any;
    officialDetails: any;
    banks: any;
    firstInstallment: any;
    secondInstallment: any;
    thirdInstallment: any;
    paymentDetails: any;
    refetch: () => void;
}> = ({
    activeTab,
    setActiveTab,
    project,
    officialDetails,
    banks,
    firstInstallment,
    secondInstallment,
    thirdInstallment,
    paymentDetails,
    refetch
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap transition-colors duration-200 ${
                                activeTab === tab
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6">
                {activeTab === 'बैंकको विवरण' && (
                    <BankDetailsSection 
                        project={project}
                        officialDetails={officialDetails}
                        banks={banks}
                        refetch={refetch}
                    />
                )}
                
                {activeTab === 'पहिलो पेस्की भुक्तानी' && (
                    <InstallmentSection 
                        title="पहिलो पेश्की भुक्तानी"
                        installmentData={firstInstallment}
                        project={project}
                        type="first"
                        refetch={refetch}
                    />
                )}
                
                {activeTab === 'दोस्रो किस्ता भुक्तानी' && (
                    <InstallmentSection 
                        title="दोस्रो किस्ता भुक्तानी"
                        installmentData={secondInstallment}
                        project={project}
                        type="second"
                        refetch={refetch}
                    />
                )}
                
                {activeTab === 'अन्तिम किस्ता भुक्तानी' && (
                    <InstallmentSection 
                        title="अन्तिम किस्ता भुक्तानी"
                        installmentData={thirdInstallment}
                        project={project}
                        type="third"
                        refetch={refetch}
                    />
                )}
                
                {activeTab === 'भुक्तानी विवरण' && (
                    <PaymentDetailsSection 
                        paymentDetails={paymentDetails}
                        project={project}
                        refetch={refetch}
                    />
                )}
            </div>
        </div>
    );
};

export default InstallmentTabs;