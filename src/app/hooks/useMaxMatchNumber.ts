import { useState, useEffect } from "react";

export function useMaxMatchNumber() {
  const [maxMatchNumber, setMaxMatchNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaxMatchNumber = async () => {
      try {
        const response = await fetch("/api/matches/latest");
        const data = await response.json();
        if (response.ok && data.maxMatchNumber) {
          setMaxMatchNumber(data.maxMatchNumber);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Error al buscar el partido"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaxMatchNumber();
  }, []);

  return { maxMatchNumber, isLoading, error };
}
