import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const promotionalImages = [
  {
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    title: "Special Spring Cleaning Offer",
    description: "Get 20% off on your first booking"
  },
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Tech Support Services",
    description: "Expert technicians available 24/7"
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    title: "Work From Home Services",
    description: "Professional setup and maintenance"
  },
  {
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    title: "Garden Maintenance",
    description: "Transform your outdoor space"
  },
];

export const PromotionalCarousel = () => {
  return (
    <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {promotionalImages.map((promo, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-0 overflow-hidden">
                  <CardContent className="p-0 relative aspect-[16/9]">
                    <img
                      src={`${promo.url}?auto=format&fit=crop&w=1200&h=675`}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
                      <p className="text-sm">{promo.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};