import { useEffect, useState } from "react";

interface useChatScrollProps {
  chatdivRef: React.RefObject<HTMLDivElement>;
  bottomdivRef: React.RefObject<HTMLDivElement>;
  count: number;
}

export const useChatScroll = ({
  chatdivRef,
  bottomdivRef,
  count,
}: useChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const chatdiv = chatdivRef.current;
    const bottomdiv = bottomdivRef.current;

    const autoScroll = () => {
      if (!hasInitialized && bottomdiv) {
        return true;
      }

      if (!chatdiv) {
        return false;
      }
      const distance =
        chatdiv?.scrollHeight - chatdiv?.scrollTop - chatdiv?.clientHeight;

      return distance <= 400;
    };

    if (autoScroll()) {
      setTimeout(() => {
        bottomdiv?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [count]);
};
