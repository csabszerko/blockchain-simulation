import { useNodeContext } from "@/context/NodeContext.js";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.js";
import BlockCard from "./BlockCard.js";
import AutoHeight from "embla-carousel-auto-height";

export default function BlockCarousel() {
  const { blocks } = useNodeContext();

  return (
    <Carousel
      className="top-8 p-4 select-none"
      opts={{
        startIndex: blocks.length,
        skipSnaps: true,
      }}
    >
      <CarouselContent>
        {blocks.map((block) => (
          <CarouselItem
            className="md-lg:basis-1 lg:basis-1/3"
            key={block.index}
          >
            <BlockCard block={block} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
