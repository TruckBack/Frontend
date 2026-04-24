import { useLocation, useNavigate } from 'react-router-dom';

interface UseRoleNavigationOptions {
    routeMap: Record<string, string>;
    defaultValue: string;
    chatPath: string;
    chatValue: string;
}

export function useRoleNavigation({ routeMap, defaultValue, chatPath, chatValue }: UseRoleNavigationOptions) {
    const location = useLocation();
    const navigate = useNavigate();

    const currentValue = (() => {
        if (location.pathname.startsWith(chatPath)) {
            return chatValue;
        }

        const matched = Object.entries(routeMap).find(([, path]) => path === location.pathname);
        return matched?.[0] ?? defaultValue;
    })();

    const handleChange = (newValue: string) => {
        const targetPath = routeMap[newValue];

        if (targetPath) {
            navigate(targetPath);
        }
    };

    return {
        currentValue,
        handleChange,
    };
}
