import type { ChangeEvent, RefObject } from 'react';
import { ImageOutlined, Inventory2Outlined } from '@mui/icons-material';
import { Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material';
import AIInsightsCard from '../../shared/AIInsightsCard';
import type { NewOrderFieldErrors, NewOrderFormData } from '../../../hooks/useNewOrderFlow';

interface NewOrderPackageStepProps {
    imageInputRef: RefObject<HTMLInputElement | null>;
    attachmentName: string;
    formData: NewOrderFormData;
    fieldErrors: NewOrderFieldErrors;
    onFieldChange: <K extends keyof NewOrderFormData>(field: K, value: NewOrderFormData[K]) => void;
    hasTouchedDescription: boolean;
    hasBlurredDescription: boolean;
    packageInsight: string;
    isGeneratingPackageInsight: boolean;
    onDescriptionChange: (value: string) => void;
    onDescriptionBlur: () => void;
    onAttachmentClick: () => void;
    onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function NewOrderPackageStep({
    imageInputRef,
    attachmentName,
    formData,
    fieldErrors,
    onFieldChange,
    hasTouchedDescription,
    hasBlurredDescription,
    packageInsight,
    isGeneratingPackageInsight,
    onDescriptionChange,
    onDescriptionBlur,
    onAttachmentClick,
    onAttachmentChange,
}: NewOrderPackageStepProps) {
    return (
        <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Inventory2Outlined color="primary" fontSize="small" />
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                        Package Information
                    </Typography>
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Package Type
                    </Typography>
                    <TextField
                        select
                        size="small"
                        fullWidth
                        required
                        value={formData.packageType}
                        onChange={(event) => onFieldChange('packageType', event.target.value)}
                        error={Boolean(fieldErrors.packageType)}
                        helperText={fieldErrors.packageType}
                    >
                        <MenuItem value="" disabled>Select package type</MenuItem>
                        <MenuItem value="documents">Documents</MenuItem>
                        <MenuItem value="electronics">Electronics</MenuItem>
                        <MenuItem value="furniture">Furniture</MenuItem>
                        <MenuItem value="grocery">Grocery</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Weight (kg)
                    </Typography>
                    <TextField
                        type="number"
                        size="small"
                        fullWidth
                        required
                        placeholder="Enter weight"
                        value={formData.weightKg}
                        onChange={(event) => onFieldChange('weightKg', event.target.value)}
                        error={Boolean(fieldErrors.weightKg)}
                        helperText={fieldErrors.weightKg}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Dimensions (L x W x H cm)
                    </Typography>
                    <TextField
                        size="small"
                        fullWidth
                        required
                        placeholder="e.g. 50 x 30 x 20"
                        value={formData.dimensions}
                        onChange={(event) => onFieldChange('dimensions', event.target.value)}
                        error={Boolean(fieldErrors.dimensions)}
                        helperText={fieldErrors.dimensions}
                    />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Description
                    </Typography>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Describe the package..."
                        multiline
                        minRows={4}
                        required
                        value={formData.description}
                        onChange={(event) => onDescriptionChange(event.target.value)}
                        onBlur={onDescriptionBlur}
                        error={Boolean(fieldErrors.description)}
                        helperText={fieldErrors.description}
                    />
                </Stack>

                {hasTouchedDescription && hasBlurredDescription && (
                    <Stack spacing={0.75}>
                        <AIInsightsCard
                            insight={packageInsight}
                            isGenerating={isGeneratingPackageInsight}
                            emptyText='Type a package description, then tap outside the field to generate insights.'
                        />
                    </Stack>
                )}

                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onAttachmentChange}
                />

                <Stack spacing={0.5}>
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<ImageOutlined />}
                        onClick={onAttachmentClick}
                        sx={{ textTransform: 'none' }}
                    >
                        Add image attachment
                    </Button>
                    {attachmentName && (
                        <Typography variant="caption" color="text.secondary">
                            Selected: {attachmentName}
                        </Typography>
                    )}
                    {fieldErrors.attachmentName && (
                        <Typography variant="caption" color="error.main">
                            {fieldErrors.attachmentName}
                        </Typography>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
}
