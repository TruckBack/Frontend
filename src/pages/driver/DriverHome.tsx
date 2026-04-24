import { Outlet } from 'react-router-dom';
import DriverBottomNav from '../../components/DriverBottomNav';
import RoleShell from '../../components/shared/RoleShell';

export default function DriverHome() {
    return (
        <RoleShell navigation={<DriverBottomNav />}>
            <Outlet />
        </RoleShell>
    );
}
