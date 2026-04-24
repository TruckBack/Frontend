import type { ChangeEvent, RefObject } from 'react';
import { ImageOutlined, Inventory2Outlined } from '@mui/icons-material';
import { Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material';

interface NewOrderPackageStepProps {
    imageInputRef: RefObject<HTMLInputElement | null>;
    attachmentName: string;
    onAttachmentClick: () => void;
    onAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function NewOrderPackageStep({
    imageInputRef,
    attachmentName,
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
                    <TextField select size="small" fullWidth defaultValue="">
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
                    <TextField type="number" size="small" fullWidth placeholder="Enter weight" />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Dimensions (L x W x H cm)
                    </Typography>
                    <TextField size="small" fullWidth placeholder="e.g. 50 x 30 x 20" />
                </Stack>

                <Stack spacing={0.75}>
                    <Typography variant="subtitle2" fontWeight={600}>
                        Special Instructions
                    </Typography>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Any special handling instructions..."
                        multiline
                        minRows={4}
                    />
                </Stack>

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
                </Stack>
            </Stack>
        </Card>
    );
}
