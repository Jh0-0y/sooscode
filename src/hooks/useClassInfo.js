import { useEffect, useState } from "react";
import { fetchClassInfo } from "../services/classService";

export function useClassInfo(classId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const info = await fetchClassInfo(classId);
        if (mounted) setData(info);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [classId]);

  return { data, loading, error };
}
