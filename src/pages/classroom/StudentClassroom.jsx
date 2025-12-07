// pages/classroom/StudentClassroom.jsx
import { useState } from 'react';
import styles from './StudentClassroom.module.css';
import ClassHeader from "@/features/classroom/ClassHeader.jsx";
import Sidebar from "@/features/classroom/Sidebar.jsx";
import ChatPanel from "@/features/chat/ChatPanel.jsx";
import CodeEditor from "@/features/code/CodeEditor.jsx";
import OutputPanel from "@/features/classroom/OutputPanel.jsx";
import TabButton from "@/features/classroom/TabButton.jsx";
import SnapshotList from "@/features/snapshot/SnapshotList.jsx";
import {ChatIcon} from "@livekit/components-react";

// 임시 데이터
const mockTeacherCode = `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

const mockSnapshots = [
    { id: 1, name: '스냅샷 1 - 기본 구조', code: 'console.log("Hello");', createdAt: '14:30' },
    { id: 2, name: '스냅샷 2 - 함수 추가', code: 'function test() {}', createdAt: '14:45' },
    { id: 3, name: '스냅샷 3 - 완성본', code: 'const result = 42;', createdAt: '15:00' },
];

const StudentClassroom = () => {
    const [myCode, setMyCode] = useState('// 여기에 코드를 작성하세요\n');
    const [myOutput, setMyOutput] = useState('');
    const [rightTab, setRightTab] = useState('teacher');
    const [sidebarTab, setSidebarTab] = useState('chat');
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'teacher', name: '김선생', message: '오늘은 피보나치 함수를 배워봅시다.' },
        { id: 2, sender: 'student', name: '나', message: '네, 알겠습니다!' },
    ]);

    const teacherOutput = '55';

    const handleRunCode = () => {
        setMyOutput('코드 실행 결과가 여기에 표시됩니다.');
    };

    const handleSendChat = (message) => {
        setChatMessages([...chatMessages, {
            id: Date.now(),
            sender: 'student',
            name: '나',
            message,
        }]);
    };

    const handleSelectSnapshot = (snapshot) => {
        setSelectedSnapshot(snapshot);
    };

    const handleRestoreSnapshot = (snapshot) => {
        setMyCode(snapshot.code);
    };

    const displayCode = rightTab === 'teacher'
        ? mockTeacherCode
        : selectedSnapshot?.code || '스냅샷을 선택하세요';

    const displayOutput = rightTab === 'teacher'
        ? teacherOutput
        : selectedSnapshot ? '스냅샷 실행결과' : '';

    const sidebarTabs = [
        { id: 'chat', label: '채팅', icon: <ChatIcon /> },
    ];

    const rightTabs = [
        { id: 'teacher', label: '선생님 코드' },
        { id: 'snapshot', label: '스냅샷' },
    ];

    return (
        <div className={styles.container}>
            <ClassHeader
                className="Python 기초반 - 3주차"
                status="live"
                onOpenSettings={() => alert('설정')}
            />

            <div className={styles.main}>
                <Sidebar
                    tabs={sidebarTabs}
                    activeTab={sidebarTab}
                    onTabChange={setSidebarTab}
                >
                    {sidebarTab === 'chat' && (
                        <ChatPanel
                            messages={chatMessages}
                            onSendMessage={handleSendChat}
                            currentUserType="student"
                        />
                    )}
                </Sidebar>

                <div className={styles.content}>
                    {/* Left Panel - My Code */}
                    <div className={styles.panel}>
                        <CodeEditor
                            title="내 코드"
                            code={myCode}
                            onChange={setMyCode}
                            showRunButton
                            onRun={handleRunCode}
                        />
                        <OutputPanel output={myOutput} />
                    </div>

                    {/* Right Panel - Teacher Code / Snapshot */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <TabButton
                                tabs={rightTabs}
                                activeTab={rightTab}
                                onTabChange={setRightTab}
                            />
                        </div>

                        {rightTab === 'snapshot' && (
                            <SnapshotList
                                snapshots={mockSnapshots}
                                selectedId={selectedSnapshot?.id}
                                onSelect={handleSelectSnapshot}
                                onRestore={handleRestoreSnapshot}
                            />
                        )}

                        <CodeEditor
                            title=""
                            code={displayCode}
                            readOnly
                        />
                        <OutputPanel output={displayOutput} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentClassroom;
