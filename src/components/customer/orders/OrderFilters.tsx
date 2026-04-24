import { Button, Stack } from '@mui/material';
import type { CustomerOrderStatus } from '../../../utils/statusUtils';

interface OrderFiltersProps {
    selectedFilter: 'all' | CustomerOrderStatus;
    onSelectFilter: (filter: 'all' | CustomerOrderStatus) => void;
}

export default function OrderFilters({ selectedFilter, onSelectFilter }: OrderFiltersProps) {
    return (
        <Stack direction="row" spacing={1}>
            <Button
                size="small"
                variant={selectedFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => onSelectFilter('all')}
                sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
            >
                All
            </Button>
            <Button
                size="small"
                variant={selectedFilter === 'pending' ? 'contained' : 'outlined'}
                onClick={() => onSelectFilter('pending')}
                sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
            >
                Pending
            </Button>
            <Button
                size="small"
                variant={selectedFilter === 'in-transit' ? 'contained' : 'outlined'}
                onClick={() => onSelectFilter('in-transit')}
                sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
            >
                In Transit
            </Button>
            <Button
                size="small"
                variant={selectedFilter === 'delivered' ? 'contained' : 'outlined'}
                onClick={() => onSelectFilter('delivered')}
                sx={{ textTransform: 'none', borderRadius: 99, minWidth: 0, px: 2.2 }}
            >
                Delivered
            </Button>
        </Stack>
    );
}
