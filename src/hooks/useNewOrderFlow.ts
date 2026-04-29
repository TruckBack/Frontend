import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ORDER_STEPS } from '../components/customer/new-order/orderSteps';
import apiService from '../services/api';
import { orderService } from '../services/order';
import type { OrderCreate } from '../services/types';

export interface NewOrderFormData {
    pickupAddress: string;
    deliveryAddress: string;
    preferredDate: string;
    pickupTime: string;
    deliveryBy: string;
    packageType: string;
    weightKg: string;
    dimensions: string;
    description: string;
    budget: string;
}

export type NewOrderFieldErrors = Partial<Record<keyof NewOrderFormData | 'attachmentName', string>>;

const initialFormData: NewOrderFormData = {
    pickupAddress: '',
    deliveryAddress: '',
    preferredDate: '',
    pickupTime: '',
    deliveryBy: '',
    packageType: '',
    weightKg: '',
    dimensions: '',
    description: '',
    budget: '',
};

const hasErrors = (errors: NewOrderFieldErrors) => Object.keys(errors).length > 0;

const buildPackageInsight = (text: string) => {
    const normalizedText = text.trim();
    const lower = normalizedText.toLowerCase();

    const notes: string[] = [];

    if (lower.includes('fragile') || lower.includes('glass')) {
        notes.push('Handle as fragile and avoid stacking.');
    }

    if (lower.includes('electronics') || lower.includes('device')) {
        notes.push('Protect with anti-shock padding and keep dry.');
    }

    if (lower.includes('document') || lower.includes('paper')) {
        notes.push('Use a waterproof sleeve to prevent edge damage.');
    }

    if (notes.length === 0) {
        notes.push('Package appears standard; use secure wrapping and clear labeling.');
    }

    return `AI Insight: ${notes.join(' ')} Suggested priority: normal delivery unless urgent timing is requested.`;
};

const validateStep = (step: number, formData: NewOrderFormData, attachmentName: string): NewOrderFieldErrors => {
    const errors: NewOrderFieldErrors = {};

    if (step === 1) {
        if (!formData.pickupAddress.trim()) {
            errors.pickupAddress = 'Pickup address is required.';
        }

        if (!formData.deliveryAddress.trim()) {
            errors.deliveryAddress = 'Delivery address is required.';
        }

        if (!formData.preferredDate) {
            errors.preferredDate = 'Preferred date is required.';
        }

        if (!formData.pickupTime) {
            errors.pickupTime = 'Pickup time is required.';
        }

        if (!formData.deliveryBy) {
            errors.deliveryBy = 'Delivery-by time is required.';
        }
    }

    if (step === 2) {
        if (!formData.packageType) {
            errors.packageType = 'Package type is required.';
        }

        const weight = Number(formData.weightKg);
        if (!formData.weightKg.trim()) {
            errors.weightKg = 'Package weight is required.';
        } else if (Number.isNaN(weight) || weight <= 0) {
            errors.weightKg = 'Weight must be greater than 0.';
        }

        if (!formData.dimensions.trim()) {
            errors.dimensions = 'Dimensions are required.';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required.';
        }

        if (!attachmentName.trim()) {
            errors.attachmentName = 'Image attachment is required.';
        }
    }

    if (step === 3) {
        const budget = Number(formData.budget);
        if (!formData.budget.trim()) {
            errors.budget = 'Budget is required.';
        } else if (Number.isNaN(budget) || budget <= 0) {
            errors.budget = 'Budget must be greater than 0.';
        }
    }

    return errors;
};

export function useNewOrderFlow() {
    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const packageInsightTimeoutRef = useRef<number | null>(null);
    const budgetInsightCacheRef = useRef<{ key: string; result: string } | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [attachmentName, setAttachmentName] = useState('');
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<NewOrderFormData>(initialFormData);
    const [fieldErrors, setFieldErrors] = useState<NewOrderFieldErrors>({});
    const [hasTouchedDescription, setHasTouchedDescription] = useState(false);
    const [hasBlurredDescription, setHasBlurredDescription] = useState(false);
    const [packageInsight, setPackageInsight] = useState('');
    const [isGeneratingPackageInsight, setIsGeneratingPackageInsight] = useState(false);
    const [isGeneratingBudgetInsight, setIsGeneratingBudgetInsight] = useState(true);
    const [budgetInsight, setBudgetInsight] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (currentStep !== 3) return;

        const cacheKey = JSON.stringify({
            packageType: formData.packageType,
            preferredDate: formData.preferredDate,
            pickupTime: formData.pickupTime,
            dimensions: formData.dimensions,
            description: formData.description,
        });

        if (budgetInsightCacheRef.current?.key === cacheKey) {
            setBudgetInsight(budgetInsightCacheRef.current.result);
            setIsGeneratingBudgetInsight(false);
            return;
        }

        setIsGeneratingBudgetInsight(true);
        setBudgetInsight('');

        const message =
            `Please estimate a fair delivery price (in USD) for the following shipment:\n` +
            `- Package Type: ${formData.packageType}\n` +
            `- Delivery Date: ${formData.preferredDate}\n` +
            `- Pickup Time: ${formData.pickupTime}\n` +
            `- Dimensions: ${formData.dimensions}\n` +
            `- Description: ${formData.description}\n` +
            `Based on these details, provide a concise price estimation with a brief explanation.`;

        apiService.post<{ result?: string; message?: string } | string>('/aiprice', { message })
            .then((response) => {
                const data = response.data;
                const result =
                    typeof data === 'string'
                        ? data
                        : (data as { result?: string; message?: string }).result ??
                          (data as { result?: string; message?: string }).message ??
                          'No estimate available.';
                setBudgetInsight(result);
                budgetInsightCacheRef.current = { key: cacheKey, result };
            })
            .catch(() => {
                setBudgetInsight('Unable to estimate price at this time. Please enter your budget manually.');
            })
            .finally(() => {
                setIsGeneratingBudgetInsight(false);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    useEffect(() => {
        return () => {
            if (packageInsightTimeoutRef.current !== null) {
                window.clearTimeout(packageInsightTimeoutRef.current);
            }
        };
    }, []);

    const setFormField = <K extends keyof NewOrderFormData>(field: K, value: NewOrderFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setFieldErrors((prev) => {
            if (!prev[field]) {
                return prev;
            }

            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handlePackageDescriptionChange = (value: string) => {
        if (!hasTouchedDescription) {
            setHasTouchedDescription(true);
        }

        setFormField('description', value);
    };

    const handlePackageDescriptionBlur = () => {
        setHasBlurredDescription(true);

        const trimmed = formData.description.trim();

        if (packageInsightTimeoutRef.current !== null) {
            window.clearTimeout(packageInsightTimeoutRef.current);
            packageInsightTimeoutRef.current = null;
        }

        if (!trimmed) {
            setPackageInsight('');
            setIsGeneratingPackageInsight(false);
            return;
        }

        setIsGeneratingPackageInsight(true);

        packageInsightTimeoutRef.current = window.setTimeout(() => {
            setPackageInsight(buildPackageInsight(trimmed));
            setIsGeneratingPackageInsight(false);
            packageInsightTimeoutRef.current = null;
        }, 1500);
    };

    const handleContinue = async () => {
        const errors = validateStep(currentStep, formData, attachmentName);

        if (hasErrors(errors)) {
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});

        if (currentStep === ORDER_STEPS.length) {
            setIsSubmitting(true);
            try {
                // In a real app, you'd use a geocoding service.
                const orderPayload: OrderCreate = {
                    pickup_address: formData.pickupAddress,
                    pickup_lat: 34.0522, // Placeholder
                    pickup_lng: -118.2437, // Placeholder
                    dropoff_address: formData.deliveryAddress,
                    dropoff_lat: 34.0522, // Placeholder
                    dropoff_lng: -118.2437, // Placeholder
                    cargo_description: formData.description,
                    cargo_weight_kg: parseFloat(formData.weightKg),
                    notes: `Dimensions: ${formData.dimensions}, Package Type: ${formData.packageType}`,
                    price_cents: Math.round(parseFloat(formData.budget) * 100),
                };

                // TODO: Handle image upload with uploadService
                // For now, we just log the file
                if (attachmentFile) {
                    console.info('Attached file:', attachmentFile.name);
                }

                await orderService.createOrder(orderPayload);
                setIsSubmitted(true);
                console.info('Successfully submitted new order:', orderPayload);
            } catch (error) {
                console.error('Failed to submit order:', error);
                setFieldErrors({ budget: 'Failed to create order. Please try again.' });
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        setCurrentStep((prev) => Math.min(prev + 1, ORDER_STEPS.length));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleStepChange = (targetStep: number) => {
        if (targetStep === currentStep) {
            return;
        }

        if (targetStep < currentStep) {
            setCurrentStep(targetStep);
            return;
        }

        for (let step = currentStep; step < targetStep; step += 1) {
            const errors = validateStep(step, formData, attachmentName);

            if (hasErrors(errors)) {
                setFieldErrors(errors);
                return;
            }
        }

        setFieldErrors({});
        setCurrentStep(targetStep);
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
        setAttachmentFile(file);

        setFieldErrors((prev) => {
            if (!prev.attachmentName) {
                return prev;
            }

            const next = { ...prev };
            delete next.attachmentName;
            return next;
        });
    };

    return {
        imageInputRef,
        currentStep,
        attachmentName,
        formData,
        fieldErrors,
        hasTouchedDescription,
        hasBlurredDescription,
        packageInsight,
        isGeneratingPackageInsight,
        budgetInsight,
        isGeneratingBudgetInsight,
        isSubmitting,
        isSubmitted,
        setFormField,
        handlePackageDescriptionChange,
        handlePackageDescriptionBlur,
        handleContinue,
        handleBack,
        handleStepChange,
        handleImageAttachmentClick,
        handleImageAttachmentChange,
    };
}
