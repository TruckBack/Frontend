import {
    Box,
    Button,
    Stack,
    useTheme,
} from '@mui/material';
import OrderStepProgress from '../../components/customer/new-order/OrderStepProgress';
import NewOrderLocationStep from '../../components/customer/new-order/NewOrderLocationStep';
import NewOrderPackageStep from '../../components/customer/new-order/NewOrderPackageStep';
import NewOrderBudgetStep from '../../components/customer/new-order/NewOrderBudgetStep';
import NewOrderSummaryStep from '../../components/customer/new-order/NewOrderSummaryStep';
import { ORDER_STEPS } from '../../components/customer/new-order/orderSteps';
import { useNewOrderFlow } from '../../hooks/useNewOrderFlow';
import PageHeader from '../../components/shared/PageHeader';

const CustomerNewOrder = () => {
    const theme = useTheme();
    const {
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
        setFormField,
        handlePackageDescriptionChange,
        handlePackageDescriptionBlur,
        handleContinue,
        handleBack,
        handleStepChange,
        handleImageAttachmentClick,
        handleImageAttachmentChange,
    } = useNewOrderFlow();

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 680,
                mx: 'auto',
                px: { xs: 2, sm: 3 },
                py: { xs: 2.5, sm: 3 },
                boxSizing: 'border-box',
                height: { xs: 'calc(100dvh - 56px - env(safe-area-inset-bottom))', md: '100dvh' },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Stack
                spacing={2.5}
                sx={{
                    backgroundColor: 'background.default',
                    zIndex: 1,
                    pb: 1.5,
                }}
            >
                <Stack spacing={0.5}>
                    <PageHeader
                        title="Request a Delivery"
                        subtitle="Fill in the details for your delivery order"
                    />

                </Stack>

                <OrderStepProgress
                    steps={ORDER_STEPS}
                    currentStep={currentStep}
                    onStepChange={handleStepChange}
                />

            </Stack>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pr: { xs: 0, sm: 0.5 },
                    pb: 1,
                }}
            >
                <Stack spacing={2.5}>
                    {currentStep === 1 && (
                        <NewOrderLocationStep
                            formData={formData}
                            fieldErrors={fieldErrors}
                            onFieldChange={setFormField}
                        />
                    )}

                    {currentStep === 2 && (
                        <NewOrderPackageStep
                            imageInputRef={imageInputRef}
                            attachmentName={attachmentName}
                            formData={formData}
                            fieldErrors={fieldErrors}
                            onFieldChange={setFormField}
                            hasTouchedDescription={hasTouchedDescription}
                            hasBlurredDescription={hasBlurredDescription}
                            packageInsight={packageInsight}
                            isGeneratingPackageInsight={isGeneratingPackageInsight}
                            onDescriptionChange={handlePackageDescriptionChange}
                            onDescriptionBlur={handlePackageDescriptionBlur}
                            onAttachmentClick={handleImageAttachmentClick}
                            onAttachmentChange={handleImageAttachmentChange}
                        />
                    )}

                    {currentStep === 3 && (
                        <NewOrderBudgetStep
                            formData={formData}
                            fieldErrors={fieldErrors}
                            onFieldChange={setFormField}
                            budgetInsight={budgetInsight}
                            isGeneratingBudgetInsight={isGeneratingBudgetInsight}
                        />
                    )}

                    {currentStep === 4 && (
                        <NewOrderSummaryStep
                            formData={formData}
                            attachmentName={attachmentName}
                        />
                    )}

                    <Stack direction="row" spacing={1.25}>
                        {currentStep > 1 && (
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleBack}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    minWidth: 110,
                                }}
                            >
                                Back
                            </Button>
                        )}

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleContinue}
                            sx={{
                                borderRadius: 2,
                                py: 1.2,
                                background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                            }}
                        >
                            {currentStep === ORDER_STEPS.length ? 'Submit Order' : 'Continue'}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default CustomerNewOrder;
