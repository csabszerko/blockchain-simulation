import { Separator } from "@/components/ui/separator.js";
import BlockCarousel from "./BlockCarousel.js";

export default function BlockViewer() {
  return (
    <div className="mx-auto max-w-6/8 md:max-w-12/14 mt-14">
      <BlockCarousel />
    </div>
  );
}
