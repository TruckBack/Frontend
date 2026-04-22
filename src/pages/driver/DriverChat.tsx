import ChatWorkspace from '../../components/chat/ChatWorkspace';

const DriverChat = () => {
    return (
        <ChatWorkspace
            role="driver"
            title="Driver Messages"
            subtitle="Chat with customers about assigned deliveries."
            basePath="/driver/chat"
            emptyMessage="No customer conversations are available yet."
        />
    );
};

export default DriverChat;
