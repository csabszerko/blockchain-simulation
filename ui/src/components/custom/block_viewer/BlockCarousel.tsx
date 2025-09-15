import { useNodeContext } from "@/context/NodeContext.js";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.js";
import BlockCard from "./BlockCard.js";

export default function BlockCarousel() {
  const { blocks } = useNodeContext();

  return (
    <>
      <Carousel
        className="select-none md:p-2"
        opts={{
          startIndex: blocks.length,
          skipSnaps: true,
        }}
      >
        <CarouselContent>
          {blocks.map((block) => (
            <CarouselItem
              className={`sm-md:basis-1/1 md:max-w-1/2 lg:max-w-1/2 md:basis-1/${Math.min(
                2,
                blocks.length
              )} lg:basis-1/${Math.min(3, blocks.length)}`}
              key={block.index}
            >
              <BlockCard block={block} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
