import React, { useState, useEffect } from 'react';
import styles from './UserFilter.module.css';

/**
 * 사용자 검색 및 필터 컴포넌트
 * @param {string} keyword - 검색어
 * @param {Function} onSearch - 검색 핸들러
 * @param {string} startDate - 가입 시작일 필터
 * @param {string} endDate - 가입 종료일 필터
 * @param {string} filterRole - 권한 필터 (STUDENT/INSTRUCTOR/ADMIN/'')
 * @param {Function} onFilterChange - 필터 변경 핸들러
 * @param {Function} onSortChange - 정렬 변경 핸들러
 * @param {Function} onReset - 필터 초기화 핸들러
 */
const UserFilter = ({
                        keyword = '',
                        onSearch,
                        startDate = '',
                        endDate = '',
                        filterRole = '',
                        onFilterChange,
                        onSortChange,
                        onReset
                    }) => {
    const [searchValue, setSearchValue] = useState(keyword);
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);
    const [sortValue, setSortValue] = useState('createdAt-DESC');

    // filterRole을 select value 형식으로 변환 (대문자 → 소문자, 빈값 → 'all')
    const getRoleSelectValue = (role) => {
        if (!role) return 'all';
        return role.toLowerCase();
    };

    const [localRole, setLocalRole] = useState(getRoleSelectValue(filterRole));

    // 외부에서 keyword가 변경되면 동기화
    useEffect(() => {
        setSearchValue(keyword);
    }, [keyword]);

    useEffect(() => {
        setLocalStartDate(startDate);
    }, [startDate]);

    useEffect(() => {
        setLocalEndDate(endDate);
    }, [endDate]);

    useEffect(() => {
        setLocalRole(getRoleSelectValue(filterRole));
    }, [filterRole]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch?.(searchValue);
        }
    };

    const handleSearchClick = () => {
        onSearch?.(searchValue);
    };

    const handleStartDateChange = (e) => {
        const value = e.target.value;
        setLocalStartDate(value);
        onFilterChange?.({ startDate: value, endDate: localEndDate });
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        setLocalEndDate(value);
        onFilterChange?.({ startDate: localStartDate, endDate: value });
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        setLocalRole(value);
        onFilterChange?.({ filterRole: value });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortValue(value);
        const [sortBy, sortDirection] = value.split('-');
        onSortChange?.(sortBy, sortDirection);
    };

    const handleReset = () => {
        setSearchValue('');
        setLocalStartDate('');
        setLocalEndDate('');
        setLocalRole('all');
        setSortValue('createdAt-DESC');
        onReset?.();
    };

    const handleClearSearch = () => {
        setSearchValue('');
        onSearch?.('');
    };

    return (
        <div className={styles.filterContainer}>
            {/* 상단 행: 날짜 필터 */}
            <div className={styles.topRow}>
                <div className={styles.dateTimeFilters}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>가입일</label>
                        <div className={styles.dateGroup}>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={localStartDate}
                                onChange={handleStartDateChange}
                                placeholder="시작일"
                            />
                            <span className={styles.separator}>~</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={localEndDate}
                                onChange={handleEndDateChange}
                                placeholder="종료일"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 행: 검색 + 권한/정렬/초기화 */}
            <div className={styles.bottomRow}>
                {/* 검색 박스 */}
                <div className={styles.searchBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="이름 또는 이메일로 검색..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    {searchValue && (
                        <button
                            className={styles.btnClear}
                            onClick={handleClearSearch}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* 필터 옵션 */}
                <div className={styles.filterOptions}>
                    <select
                        className={styles.roleSelect}
                        value={localRole}
                        onChange={handleRoleChange}
                    >
                        <option value="all">모든 권한</option>
                        <option value="student">학생</option>
                        <option value="instructor">강사</option>
                    </select>

                    <select
                        className={styles.sortSelect}
                        value={sortValue}
                        onChange={handleSortChange}
                    >
                        <option value="createdAt-DESC">최신순</option>
                        <option value="createdAt-ASC">오래된순</option>
                        <option value="name-ASC">이름순</option>
                        <option value="email-ASC">이메일순</option>
                    </select>

                    <button className={styles.btnReset} onClick={handleReset}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                        </svg>
                        초기화
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFilter;