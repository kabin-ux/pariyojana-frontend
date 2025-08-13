import React, { useState, useEffect } from 'react';
import { useInstallmentDetails } from '../../hooks/useInstallments';
import { useProjectDetail } from '../../hooks/useProjectDetail';
// import BankDetailsSection from './BankDetailsSection';
import InstallmentTabs from './InstallmentTabs';
// import PaymentDetailsSection from './PaymentDetailsSection';

interface Project {
    serial_number: number;
    budget?: number;
}

const PaymentInstallment: React.FC<{ project: Project }> = ({ project }) => {
    const [activeTab, setActiveTab] = useState('बैंकको विवरण');
    const projectIdNum = project?.serial_number;
    
    const {
        officialDetails,
        loadConsumerCommitteeDetails
    } = useProjectDetail(projectIdNum);

    const {
        banks,
        firstInstallment,
        secondInstallment,
        thirdInstallment,
        paymentDetails,
        refetch
    } = useInstallmentDetails(project.serial_number);

    useEffect(() => {
        if (projectIdNum) {
            loadConsumerCommitteeDetails();
        }
    }, [projectIdNum]);

    return (
        <div className="bg-gray-50">
            <div className="mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">किस्ता भुक्तानी सम्बन्धी विवरण</h3>
                    </div>
                </div>

                <InstallmentTabs 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    project={project}
                    officialDetails={officialDetails}
                    banks={banks}
                    firstInstallment={firstInstallment}
                    secondInstallment={secondInstallment}
                    thirdInstallment={thirdInstallment}
                    paymentDetails={paymentDetails}
                    refetch={refetch}
                />
            </div>
        </div>
    );
};

export default PaymentInstallment;