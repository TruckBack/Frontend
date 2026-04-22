import ChatWorkspace from '../../components/chat/ChatWorkspace';

const CustomerChat = () => {
    return (
        <ChatWorkspace
            role="customer"
            title="Customer Messages"
            subtitle="Chat with the drivers handling your orders."
            basePath="/customer/chat"
            emptyMessage="You do not have any active conversations yet."
        />
    );
};

export default CustomerChat;
