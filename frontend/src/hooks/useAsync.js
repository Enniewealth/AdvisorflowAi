import { useCallback, useEffect, useRef, useState } from "react";


export function useAsync(asyncFn) {
  const asyncRef = useRef(asyncFn);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    asyncRef.current = asyncFn;
  }, [asyncFn]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  return { data, setData, loading, error, refresh: run };
}
