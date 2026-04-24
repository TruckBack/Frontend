import {
    Box,
    Button,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import OrderStepProgress from '../../components/customer/new-order/OrderStepProgress';
import NewOrderLocationStep from '../../components/customer/new-order/NewOrderLocationStep';
import NewOrderPackageStep from '../../components/customer/new-order/NewOrderPackageStep';
import NewOrderBudgetStep from '../../components/customer/new-order/NewOrderBudgetStep';
import NewOrderSummaryStep from '../../components/customer/new-order/NewOrderSummaryStep';
import { ORDER_STEPS } from '../../components/customer/new-order/orderSteps';
import { useNewOrderFlow } from '../../hooks/useNewOrderFlow';

const CustomerNewOrder = () => {
    const theme = useTheme();
    const {
        imageInputRef,
        currentStep,
        attachmentName,
        handleContinue,
        handleBack,
        handleImageAttachmentClick,
        handleImageAttachmentChange,
        setCurrentStep,
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
                    <Typography variant="h6" fontWeight={600}>
                        Request a Delivery
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fill in the details for your delivery order
                    </Typography>
                </Stack>

                <OrderStepProgress
                    steps={ORDER_STEPS}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
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
                    {currentStep === 1 && <NewOrderLocationStep />}

                    {currentStep === 2 && (
                        <NewOrderPackageStep
                            imageInputRef={imageInputRef}
                            attachmentName={attachmentName}
                            onAttachmentClick={handleImageAttachmentClick}
                            onAttachmentChange={handleImageAttachmentChange}
                        />
                    )}

                    {currentStep === 3 && <NewOrderBudgetStep />}

                    {currentStep === 4 && <NewOrderSummaryStep />}

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
