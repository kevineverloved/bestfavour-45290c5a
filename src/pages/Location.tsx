import { LocationForm } from "@/components/location/LocationForm";
import { BurgerMenu } from "@/components/BurgerMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";

const Location = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {!isMobile && <BurgerMenu />}
      <LocationForm />
      {isMobile && <BottomNav />}
    </>
  );
};

export default Location;