import React, { useState } from 'react';
import styles from './ClassroomFilter.module.css';

/**
 * 클래스 검색 및 필터 컴포넌트
 * @param {string} keyword - 검색어
 * @param {Function} onSearch - 검색 핸들러
 * @param {string} startDate - 시작일 필터
 * @param {string} endDate - 종료일 필터
 * @param {string} startTime - 시작 시간 필터
 * @param {string} endTime - 종료 시간 필터
 * @param {string} classType - 클래스 유형 (online/offline/all)
 * @param {Function} onFilterChange - 필터 변경 핸들러
 * @param {Function} onSortChange - 정렬 변경 핸들러
 * @param {Function} onReset - 필터 초기화 핸들러
 * @param {Function} onAddClass - 신규 등록 핸들러
 * @param {Function} onExcelDownload - 엑셀 다운로드 핸들러
 */
const ClassroomFilter = ({
                             keyword = '',
                             onSearch,
                             startDate = '',
                             endDate = '',
                             startTime = '',
                             endTime = '',
                             classType = 'all',
                             onFilterChange,
                             onSortChange,
                             onReset,
                         }) => {
    const [searchValue, setSearchValue] = useState(keyword);
    const [filters, setFilters] = useState({
        startDate,
        endDate,
        startTime,
        endTime,
        classType
    });

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchValue);
        }
    };

    const handleFilterChange = (field, value) => {
        const newFilters = {
            ...filters,
            [field]: value
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        const [sortBy, sortDirection] = value.split('-');
        onSortChange(sortBy, sortDirection);
    };

    const handleReset = () => {
        setSearchValue('');
        const resetFilters = {
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            classType: 'all'
        };
        setFilters(resetFilters);
        onReset();
    };

    return (
        <div className={styles.filterContainer}>
            {/* 상단 행: 날짜/시간 필터 + 액션 버튼 */}
            <div className={styles.topRow}>
                <div className={styles.dateTimeFilters}>
                    {/* 날짜 필터 */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>날짜</label>
                        <div className={styles.dateGroup}>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                placeholder="시작일"
                            />
                            <span className={styles.separator}>~</span>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                placeholder="종료일"
                            />
                        </div>
                    </div>

                    {/* 시간 필터 */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>시간</label>
                        <div className={styles.timeGroup}>
                            <input
                                type="time"
                                className={styles.timeInput}
                                value={filters.startTime}
                                onChange={(e) => handleFilterChange('startTime', e.target.value)}
                            />
                            <span className={styles.separator}>~</span>
                            <input
                                type="time"
                                className={styles.timeInput}
                                value={filters.endTime}
                                onChange={(e) => handleFilterChange('endTime', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 행: 검색 + 유형/정렬/초기화 */}
            <div className={styles.bottomRow}>
                {/* 검색 박스 */}
                <div className={styles.searchBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="클래스명 또는 강사명으로 검색..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    {searchValue && (
                        <button
                            className={styles.btnClear}
                            onClick={() => {
                                setSearchValue('');
                                onSearch('');
                            }}
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
                        className={styles.typeSelect}
                        value={filters.classType}
                        onChange={(e) => handleFilterChange('classType', e.target.value)}
                    >
                        <option value="all">온/오프라인</option>
                        <option value="online">온라인</option>
                        <option value="offline">오프라인</option>
                    </select>

                    <select
                        className={styles.sortSelect}
                        onChange={handleSortChange}
                        defaultValue="createdAt-DESC"
                    >
                        <option value="createdAt-DESC">최신순</option>
                        <option value="createdAt-ASC">오래된순</option>
                        <option value="title-ASC">이름순</option>
                        <option value="startDate-ASC">시작일순</option>
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

export default ClassroomFilter;