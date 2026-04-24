import { Badge, useTheme } from '@mui/material';
import {
    ElectricBoltOutlined,
    HistoryOutlined,
    ChatBubbleOutline,
    MapOutlined,
    PersonOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import RoleBottomNav, { type RoleNavAction } from './shared/RoleBottomNav';
import { useRoleNavigation } from '../hooks/useRoleNavigation';
import { ROUTES } from '../constants/routes';
import { useUnreadCount } from '../hooks/useUnreadCount';

export default function DriverBottomNav() {
    const theme = useTheme();
    const { user } = useAuth();
    const unreadCount = useUnreadCount('driver', user?.id);

    const routeMap = {
        active: ROUTES.driver.home,
        past: ROUTES.driver.past,
        map: ROUTES.driver.map,
        chat: ROUTES.driver.chat,
        profile: ROUTES.driver.profile,
    };

    const { currentValue, handleChange } = useRoleNavigation({
        routeMap,
        defaultValue: 'active',
        chatPath: ROUTES.driver.chat,
        chatValue: 'chat',
    });

    const navSurface = theme.palette.action.hover;

    const navActions: RoleNavAction[] = [
        { value: 'active', icon: <ElectricBoltOutlined /> },
        { value: 'past', icon: <HistoryOutlined /> },
        { value: 'map', icon: <MapOutlined /> },
        {
            value: 'chat',
            icon: (
                <Badge badgeContent={unreadCount} color="error" max={99} invisible={unreadCount === 0}>
                    <ChatBubbleOutline />
                </Badge>
            ),
        },
        { value: 'profile', icon: <PersonOutlined /> },
    ];

    return (
        <RoleBottomNav
            actions={navActions}
            currentValue={currentValue}
            onChange={handleChange}
            navSurface={navSurface}
        />
    );
}
