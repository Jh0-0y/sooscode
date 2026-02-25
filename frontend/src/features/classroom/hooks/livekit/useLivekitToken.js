// src/features/livekit/hooks/useLivekitToken.js
import { useState } from 'react';
import { livekitService } from '../../services/livekitService';

const TOKEN_KEY = 'LIVEKIT_TOKEN';

export const useLivekitToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 토큰 발급 + 저장
  const issueToken = async ({ classId }) => {
    try {
      setLoading(true);
      setError(null);

      const { token } = await livekitService.createToken({ classId });

      // Session에 Token 저장
      sessionStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // token Controller
  const getToken = () => sessionStorage.getItem(TOKEN_KEY);
  const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

  return {
    issueToken,
    getToken,
    clearToken,
    loading,
    error,
  };
};
