import { legalContent } from "@/lib/constants";
import { ScrollArea } from "../ui/scroll-area";

const TermsConditions = () => {
  return (
    <ScrollArea className="flex flex-col max-h-[calc(100vh-200px)]">
      <div className="text-sm md:text-base text-text-color leading-relaxed whitespace-pre-line">
        {legalContent}
      </div>
    </ScrollArea>
  );
};

export default TermsConditions;
