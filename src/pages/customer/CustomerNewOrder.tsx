import {
    Box,
    Button,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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
        isSubmitted,
    } = useNewOrderFlow();

    if (isSubmitted) {
        return (
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 480,
                    mx: 'auto',
                    px: { xs: 2, sm: 3 },
                    py: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 3,
                }}
            >
                <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main' }} />
                <Stack spacing={1}>
                    <Typography variant="h5" fontWeight={700}>
                        Order Submitted!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your delivery request has been placed. Drivers will be notified and can accept your order shortly.
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{ borderRadius: 2 }}
                        onClick={() => navigate('/customer/orders')}
                    >
                        View My Orders
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ borderRadius: 2 }}
                        onClick={() => navigate('/customer/home')}
                    >
                        Go Home
                    </Button>
                </Stack>
            </Box>
        );
    }

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
