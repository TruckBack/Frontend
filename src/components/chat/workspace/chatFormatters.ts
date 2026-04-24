export const formatChatTime = (value: string) => {
    const date = new Date(value);

    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
    }).format(date);
};
