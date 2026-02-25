// features/classroom/hooks/useClassroomAccess.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classRoomApi } from '@/features/classroom/services/classRoomApi';

/**
 * 클래스룸 접근 권한 확인 및 정보 로드 훅
 *
 * @param {number} classId - 접근할 클래스룸 ID
 * @returns {Object} 클래스룸 정보 및 로딩 상태
 */
