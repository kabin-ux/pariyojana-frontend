import axios from "axios";
import { useEffect, useState } from "react";

interface InstallmentDetails {
    serial_no: number;
    title: string;
    description: string;
    date: string; // could also be Date if parsed
    status: string;
    file_uploaded_name: string;
}
interface PaymentDetail {
    id: number;
    serial_no: number;
    title: string;
    physical_progress?: number;
    payment_percent: number;
    amount_paid: number;
    is_active?:boolean;
    
}

export const useInstallmentDetails = (projectId: number) => {
    const [banks, setBanks] = useState([]);
    const [firstInstallment, setFirstInstallment] = useState<InstallmentDetails[] | null>(null);
    const [secondInstallment, setSecondInstallment] = useState<InstallmentDetails[] | null>(null);
    const [thirdInstallment, setThirdInstallment] = useState<InstallmentDetails[] | null>(null);

    const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);

    const [bankLoading, setBankLoading] = useState(true);
    const [firstLoading, setFirstLoading] = useState(true);
    const [secondLoading, setSecondLoading] = useState(true);
    const [thirdLoading, setThirdLoading] = useState(true);
    const [fourthLoading, setFourthLoading] = useState(true);

    const [bankError, setBankError] = useState<string | null>(null);
    const [firstError, setFirstError] = useState<string | null>(null);
    const [secondError, setSecondError] = useState<string | null>(null);
    const [thirdError, setThirdError] = useState<string | null>(null);
    const [fourthError, setFourthError] = useState<string | null>(null);

    const fetchBanks = async () => {
        try {
            setFirstLoading(true);
            const res = await axios.get(`/api/settings/bank`);
            setBanks(res.data);
        } catch (err) {
            setBankError('पहिलो किस्ताको विवरण लोड गर्न समस्या भयो।');
        } finally {
            setBankLoading(false);
        }
    };

    const fetchFirst = async () => {
        try {
            setFirstLoading(true);
            const res = await axios.get(`/api/projects/first-installment/${projectId}/`);
            setFirstInstallment(res.data);
        } catch (err) {
            setFirstError('पहिलो किस्ताको विवरण लोड गर्न समस्या भयो।');
        } finally {
            setFirstLoading(false);
        }
    };

    const fetchSecond = async () => {
        try {
            setSecondLoading(true);
            const res = await axios.get(`/api/projects/second-installment/${projectId}/`);
            setSecondInstallment(res.data);
        } catch (err) {
            setSecondError('दोस्रो किस्ताको विवरण लोड गर्न समस्या भयो।');
        } finally {
            setSecondLoading(false);
        }
    };

    const fetchThird = async () => {
        try {
            setThirdLoading(true);
            const res = await axios.get(`/api/projects/third-installment/${projectId}/`);
            setThirdInstallment(res.data);
        } catch (err) {
            setThirdError('तेस्रो किस्ताको विवरण लोड गर्न समस्या भयो।');
        } finally {
            setThirdLoading(false);
        }
    };

    const fetchPaymentDetails = async () => {
        try {
            setFourthLoading(true);
            const res = await axios.get(`/api/projects/${projectId}/payment-details/`);
            setPaymentDetails(res.data);
        } catch (err) {
            setFourthError('तेस्रो किस्ताको विवरण लोड गर्न समस्या भयो।');
        } finally {
            setFirstLoading(false);
        }
    };

    const refetch = () => {
        if (projectId) {
            fetchBanks();
            fetchFirst();
            fetchSecond();
            fetchThird();
            fetchPaymentDetails();
        }
    };

    useEffect(() => {
        refetch();
    }, [projectId]);

    return {
        banks,
        firstInstallment,
        secondInstallment,
        thirdInstallment,
        paymentDetails,
        firstLoading,
        secondLoading,
        thirdLoading,
        fourthLoading,
        firstError,
        secondError,
        thirdError,
        fourthError,
        bankError,
        bankLoading,
        refetch, // 👈 expose this for reuse after upload
    };
};
