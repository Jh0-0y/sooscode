import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './SnapshotSearchFilter.module.css';

/**
 * 스냅샷 검색 필터 UI 컴포넌트
 * 역할:
 * - 스냅샷 제목 기반 검색을 위한 입력 UI를 제공
 * - 사용자가 입력한 키워드를 상위 컴포넌트로 전달하는 역할만 수행
 */
const SnapshotSearchFilter = ({ onSearch, value }) => {

    /**
     * 입력창에 표시되는 검색어 상태
     * - 기본값은 상위에서 전달된 value를 기준으로 초기화
     */
    const [keyword, setKeyword] = useState(value || '');

    /**
     * 외부 검색 조건(value)이 변경될 경우 입력창 상태를 동기화
     * 사용 시나리오:
     * - ESC 키로 검색 조건이 초기화
     * - "전체 목록 보기" 등 외부 동작에 의해 필터가 변경
     */
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setKeyword(value || '');
    }, [value]);

    /**
     * 검색 제출 처리
     * 동작:
     * - 현재 입력된 키워드를 기준으로 상위 컴포넌트에 검색 요청을 전달
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ title: keyword });
    };
    /**
     * 검색어 초기화 처리
     * 동작:
     * - 검색 조건을 빈 값으로 초기화하여 전체 목록 조회를 유도
     * - 입력창 값은 외부 value 변경에 의해 동기화
     */
    const handleClear = () => {
        onSearch({ title: '' });
    };
    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
                <FiSearch className={styles.icon} />
                <input
                    type="text"
                    className={styles.input}
                    placeholder="스냅샷 제목 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {keyword && (
                    <button type="button" className={styles.clearBtn} onClick={handleClear}>
                        <FiX />
                    </button>
                )}
            </div>
        </form>
    );
};
export default SnapshotSearchFilter;