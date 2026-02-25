// src/features/livekit/hooks/useLivekitJoin.js
import { useLivekitToken } from './useLivekitToken';

export const useLivekitJoin = () => {
  const { issueToken } = useLivekitToken();

  // 강의방 입장 요청
  const joinLivekit = async ({ classId }) => {
    if (!classId) {
      throw new Error('classId is required');
    }

    // 여기서 "입장 요청"의 의미는
    // → LiveKit 영상 연결을 위한 토큰 발급
    return await issueToken({ classId });
  };

  return {
    joinLivekit,
  };
};
