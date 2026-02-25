import { api } from '@/services/api';

export const livekitService = {

  // LiveKit 토큰 발급
  createToken: (payload) =>
    api.post('/api/livekit/token', payload),

  // LiveKit 방 생성
  createRoom: (payload) =>
    api.post('/api/livekit/room', payload),

  // LiveKit 방 종료
  endRoom: (roomName) =>
    api.post('/api/livekit/room/end', { roomName }),

  // 특정 방 참여자 목록 조회
  getParticipants: (roomName) =>
    api.get(`/api/livekit/room/${roomName}/participants`),

  // 전체 방 목록 조회
  getRooms: () =>
    api.get('/api/livekit/rooms'),
};
