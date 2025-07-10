import axios from "axios";
import { useEffect, useState } from "react";

export const useInstallmentDetails = (projectId: number) => {
    const [banks, setBanks] = useState([]);
    const [firstInstallment, setFirstInstallment] = useState<InstallmentDetails[] | null>(null);
    const [secondInstallment, setSecondInstallment] = useState<InstallmentDetails[] | null>(null);
    const [thirdInstallment, setThirdInstallment] = useState<InstallmentDetails[] | null>(null);

    const [bankLoading, setBankLoading] = useState(true);
    const [firstLoading, setFirstLoading] = useState(true);
    const [secondLoading, setSecondLoading] = useState(true);
    const [thirdLoading, setThirdLoading] = useState(true);

    const [bankError, setBankError] = useState<string | null>(null);
    const [firstError, setFirstError] = useState<string | null>(null);
    const [secondError, setSecondError] = useState<string | null>(null);
    const [thirdError, setThirdError] = useState<string | null>(null);

    const fetchBanks = async () => {
        try {
            setFirstLoading(true);
            const res = await axios.get(`http://localhost:8000/api/settings/bank`);
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
            const res = await axios.get(`http://localhost:8000/api/projects/first-installment/${projectId}/`);
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
            const res = await axios.get(`http://localhost:8000/api/projects/second-installment/${projectId}/`);
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
            const res = await axios.get(`http://localhost:8000/api/projects/third-installment/${projectId}/`);
            setThirdInstallment(res.data);
        } catch (err) {
            setThirdError('तेस्रो किस्ताको विवरण लोड गर्न समस्या भयो।');
        } finally {
            setThirdLoading(false);
        }
    };

    const refetch = () => {
        if (projectId) {
            fetchBanks();
            fetchFirst();
            fetchSecond();
            fetchThird();
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
        firstLoading,
        secondLoading,
        thirdLoading,
        firstError,
        secondError,
        thirdError,
        refetch, // 👈 expose this for reuse after upload
    };
};
