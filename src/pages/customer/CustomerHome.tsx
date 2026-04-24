import { Outlet } from 'react-router-dom';
import CustomerBottomNav from '../../components/CustomerBottomNav';
import RoleShell from '../../components/shared/RoleShell';

export default function CustomerHome() {
    return (
        <RoleShell navigation={<CustomerBottomNav />} mobileBottomInset>
            <Outlet />
        </RoleShell>
    );
}
