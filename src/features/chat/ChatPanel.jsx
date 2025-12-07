// common/components/classroom/ChatPanel.jsx
import { useState } from 'react';
import { SendIcon } from '@/common/components/Icons';
import styles from './ChatPanel.module.css';

const ChatPanel = ({ 
    messages, 
    onSendMessage, 
    currentUserType = 'student' // 'student' | 'teacher'
}) => {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.messages}>
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`${styles.message} ${styles[msg.sender]}`}
                    >
                        <span className={styles.name}>{msg.name}</span>
                        <p className={styles.text}>{msg.message}</p>
                    </div>
                ))}
            </div>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="메시지를 입력하세요..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className={styles.sendButton} onClick={handleSend}>
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};

export default ChatPanel;
