import { useRouter } from "next/router";
import { useEffect } from "react";

export const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Stock Prediction problem.
    router.push("/problems/stock-prediction");
  }, []);

  return <></>;
};

export default IndexPage;