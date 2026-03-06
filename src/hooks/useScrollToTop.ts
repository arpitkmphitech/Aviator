import { useEffect } from "react";

const useScrollToTop = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
};

export default useScrollToTop;
