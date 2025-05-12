import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn: any) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fn();

      if (response !== null) {
        setData(response);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reftechData = () => fetchData();

  return { data, loading, reftechData };
};

export default useAppwrite;
