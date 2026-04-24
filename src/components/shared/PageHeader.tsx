import { Stack, Typography } from '@mui/material';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    titleVariant?: 'h4' | 'h5' | 'h6';
    titleWeight?: number;
}

export default function PageHeader({ title, subtitle, titleVariant = 'h6', titleWeight = 600 }: PageHeaderProps) {
    return (
        <Stack spacing={0.5}>
            <Typography variant={titleVariant} fontWeight={titleWeight}>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {subtitle}
            </Typography>
        </Stack>
    );
}
