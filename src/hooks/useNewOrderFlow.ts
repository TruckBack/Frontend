import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ORDER_STEPS } from '../components/customer/new-order/orderSteps';

export function useNewOrderFlow() {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [attachmentName, setAttachmentName] = useState('');

    const handleContinue = () => {
        setCurrentStep((prev) => Math.min(prev + 1, ORDER_STEPS.length));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleImageAttachmentClick = () => {
        imageInputRef.current?.click();
    };

    const handleImageAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setAttachmentName(file.name);
    };

    return {
        imageInputRef,
        currentStep,
        attachmentName,
        handleContinue,
        handleBack,
        handleImageAttachmentClick,
        handleImageAttachmentChange,
        setCurrentStep,
    };
}
