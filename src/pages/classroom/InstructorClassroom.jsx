// pages/classroom/InstructorClassroom.jsx
import { useState } from 'react';
import styles from './InstructorClassroom.module.css';
import ClassHeader from "@/features/classroom/ClassHeader.jsx";
import Sidebar from "@/features/classroom/Sidebar.jsx";
import ChatPanel from "@/features/chat/ChatPanel.jsx";
import ParticipantList from "@/features/classroom/ParticipantList.jsx";
import CodeEditor from "@/features/code/CodeEditor.jsx";
import OutputPanel from "@/features/classroom/OutputPanel.jsx";
import TabButton from "@/features/classroom/TabButton.jsx";
import SnapshotList from "@/features/snapshot/SnapshotList.jsx";
import {ChatIcon} from "@livekit/components-react";
import {UsersIcon} from "@/common/components/Icons.jsx";

// 임시 데이터
const mockStudents = [
    { id: 1, name: '김철수', status: 'online', code: 'console.log("철수 코드");' },
    { id: 2, name: '이영희', status: 'online', code: 'function test() { return 1; }' },
    { id: 3, name: '박민수', status: 'away', code: '// 아직 작성 중...' },
    { id: 4, name: '정수진', status: 'online', code: 'const result = 42;' },
];

const mockSnapshots = [
    { id: 1, name: '스냅샷 1 - 기본 구조', code: 'console.log("Hello");', createdAt: '14:30' },
    { id: 2, name: '스냅샷 2 - 함수 추가', code: 'function test() {}', createdAt: '14:45' },
    { id: 3, name: '스냅샷 3 - 완성본', code: 'const result = 42;', createdAt: '15:00' },
];

const InstructorClassroom = () => {
    const [myCode, setMyCode] = useState(`function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);
    const [myOutput, setMyOutput] = useState('55');
    const [rightTab, setRightTab] = useState('student');
    const [sidebarTab, setSidebarTab] = useState('chat');
    const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, sender: 'teacher', name: '나', message: '오늘은 피보나치 함수를 배워봅시다.' },
        { id: 2, sender: 'student', name: '김철수', message: '네, 알겠습니다!' },
        { id: 3, sender: 'student', name: '이영희', message: '재귀함수가 어려워요 ㅠㅠ' },
    ]);

    const handleRunCode = () => {
        setMyOutput('코드 실행 결과가 여기에 표시됩니다.');
    };

    const handleSendChat = (message) => {
        setChatMessages([...chatMessages, {
            id: Date.now(),
            sender: 'teacher',
            name: '나',
            message,
        }]);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setRightTab('student');
    };

    const handleSelectSnapshot = (snapshot) => {
        setSelectedSnapshot(snapshot);
    };

    const handleBroadcastCode = () => {
        alert('코드가 모든 학생에게 전송되었습니다.');
    };

    const handleSaveSnapshot = () => {
        alert('스냅샷이 저장되었습니다.');
    };

    const displayCode = rightTab === 'student'
        ? selectedStudent?.code || '학생을 선택하세요'
        : selectedSnapshot?.code || '스냅샷을 선택하세요';

    const displayOutput = rightTab === 'student'
        ? selectedStudent ? '학생 실행결과' : ''
        : selectedSnapshot ? '스냅샷 실행결과' : '';

    const sidebarTabs = [
        { id: 'chat', label: '채팅', icon: <ChatIcon /> },
        { id: 'participants', label: '참가자', icon: <UsersIcon /> },
    ];

    const rightTabs = [
        { id: 'student', label: selectedStudent ? `${selectedStudent.name} 코드` : '학생 코드' },
        { id: 'snapshot', label: '스냅샷' },
    ];

    const onlineCount = mockStudents.filter(s => s.status === 'online').length;

    return (
        <div className={styles.container}>
            <ClassHeader
                className="Python 기초반 - 3주차"
                status="live"
                isInstructor
                participantCount={onlineCount}
                totalParticipants={mockStudents.length}
                onBroadcast={handleBroadcastCode}
                onSaveSnapshot={handleSaveSnapshot}
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
                            currentUserType="teacher"
                        />
                    )}
                    {sidebarTab === 'participants' && (
                        <ParticipantList
                            participants={mockStudents}
                            selectedId={selectedStudent?.id}
                            onSelect={handleSelectStudent}
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

                    {/* Right Panel - Student Code / Snapshot */}
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
                                onRestore={handleSelectSnapshot}
                                showRestoreButton={false}
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

export default InstructorClassroom;
