export interface OrderStep {
    id: number;
    label: string;
}

export const ORDER_STEPS: OrderStep[] = [
    { id: 1, label: 'Location' },
    { id: 2, label: 'Package' },
    { id: 3, label: 'Price' },
    { id: 4, label: 'Summary' },
];
