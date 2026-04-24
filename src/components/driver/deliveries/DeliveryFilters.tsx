import { Button, Stack } from '@mui/material';
import type { DeliveryFilter } from '../../../hooks/useDeliveryFiltering';

interface DeliveryFiltersProps {
    selectedFilter: DeliveryFilter;
    allCount: number;
    acceptedCount: number;
    inProgressCount: number;
    onSelectFilter: (filter: DeliveryFilter) => void;
}

export default function DeliveryFilters({
    selectedFilter,
    allCount,
    acceptedCount,
    inProgressCount,
    onSelectFilter,
}: DeliveryFiltersProps) {
    const filterOptions: Array<{ value: DeliveryFilter; label: string }> = [
        { value: 'all', label: `All (${allCount})` },
        { value: 'accepted', label: `Accepted (${acceptedCount})` },
        { value: 'in-progress', label: `In Progress (${inProgressCount})` },
    ];

    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                mb: 3,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
            }}
        >
            {filterOptions.map((filter) => (
                <Button
                    key={filter.value}
                    variant={selectedFilter === filter.value ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => onSelectFilter(filter.value)}
                    sx={{
                        textTransform: 'none',
                        flexShrink: 0,
                        minWidth: { xs: 108, sm: 126 },
                    }}
                >
                    {filter.label}
                </Button>
            ))}
        </Stack>
    );
}
