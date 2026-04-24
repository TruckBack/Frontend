import { Badge, useTheme } from '@mui/material';
import {
    HomeOutlined,
    Add,
    AssignmentOutlined,
    PersonOutline,
    ChatBubbleOutline,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import RoleBottomNav, { type RoleNavAction } from './shared/RoleBottomNav';
import { useRoleNavigation } from '../hooks/useRoleNavigation';
import { ROUTES } from '../constants/routes';
import { useUnreadCount } from '../hooks/useUnreadCount';

export default function CustomerBottomNav() {
    const theme = useTheme();
    const { user } = useAuth();
    const unreadCount = useUnreadCount('customer', user?.id);

    const routeMap = {
        home: ROUTES.customer.home,
        'new-order': ROUTES.customer.newOrder,
        orders: ROUTES.customer.orders,
        chat: ROUTES.customer.chat,
        profile: ROUTES.customer.profile,
    };

    const { currentValue, handleChange } = useRoleNavigation({
        routeMap,
        defaultValue: 'home',
        chatPath: ROUTES.customer.chat,
        chatValue: 'chat',
    });

    const navSurface = theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200];

    const navActions: RoleNavAction[] = [
        { value: 'home', icon: <HomeOutlined /> },
        { value: 'new-order', icon: <Add /> },
        { value: 'orders', icon: <AssignmentOutlined /> },
        {
            value: 'chat',
            icon: (
                <Badge badgeContent={unreadCount} color="error" max={99} invisible={unreadCount === 0}>
                    <ChatBubbleOutline />
                </Badge>
            ),
        },
        { value: 'profile', icon: <PersonOutline /> },
    ];

    return (
        <RoleBottomNav
            actions={navActions}
            currentValue={currentValue}
            onChange={handleChange}
            navSurface={navSurface}
            mobileSafeArea
        />
    );
}
