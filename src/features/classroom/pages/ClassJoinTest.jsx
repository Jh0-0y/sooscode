import { encode } from '@/utils/urlEncoder';
import { useNavigate } from 'react-router-dom';

const ClassJoinTest = () => {
    const navigate = useNavigate();

    const handleJoinClass = (classId) => {
        const encoded = encode(classId);
        navigate(`/class/${encoded}`);  // ← /class/MTIz
    };

    return (
        <button onClick={() => handleJoinClass(2)}
                style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4f46e5', // indigo
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(79,70,229,0.25)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
        >
            입장
        </button>
    );
};

export default ClassJoinTest;