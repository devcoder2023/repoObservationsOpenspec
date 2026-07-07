import { usePage } from '@inertiajs/react';

export function usePermissions(): {
    can: (permission: string) => boolean;
    permissions: string[];
} {
    const { auth } = usePage().props;

    const permissions: string[] = auth.permissions ?? [];

    return {
        can: (permission: string): boolean => permissions.includes(permission),
        permissions,
    };
}
