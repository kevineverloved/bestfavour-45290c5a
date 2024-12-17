import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format, isFuture, isPast, isToday } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { BurgerMenu } from "@/components/BurgerMenu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const BookingsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        navigate('/auth');
        return null;
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service_providers (
            business_name,
            hourly_rate,
            service_type_id,
            service_types (
              name,
              category_id,
              service_categories (
                name
              )
            )
          )
        `)
        .order('booking_date', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading bookings",
          description: error.message
        });
        return null;
      }

      return data;
    }
  });

  const categorizeBookings = (bookings: any[] | null) => {
    if (!bookings) return { past: [], current: [], future: [] };

    return bookings.reduce((acc, booking) => {
      const bookingDate = new Date(booking.booking_date);
      
      if (isToday(bookingDate)) {
        acc.current.push(booking);
      } else if (isPast(bookingDate)) {
        acc.past.push(booking);
      } else if (isFuture(bookingDate)) {
        acc.future.push(booking);
      }
      
      return acc;
    }, { past: [], current: [], future: [] });
  };

  const categorizedBookings = categorizeBookings(bookings);

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {booking.service_providers.business_name}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({booking.service_providers.service_types?.name})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(booking.booking_date), 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{booking.booking_time} ({booking.duration} hours)</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{booking.address}</span>
        </div>
        {booking.notes && (
          <div className="text-sm text-muted-foreground">
            <strong>Notes:</strong> {booking.notes}
          </div>
        )}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-lg">R{booking.total_amount}</span>
          </div>
          <div className="mt-2">
            <span className={`px-2 py-1 text-sm rounded-full ${
              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {isMobile ? <BottomNav /> : <BurgerMenu />}
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Your Bookings</h1>
        
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="current">
              Today ({categorizedBookings.current.length})
            </TabsTrigger>
            <TabsTrigger value="future">
              Upcoming ({categorizedBookings.future.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({categorizedBookings.past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-6">
            {categorizedBookings.current.length === 0 ? (
              <Card>
                <CardContent className="text-center py-6 text-muted-foreground">
                  No bookings scheduled for today
                </CardContent>
              </Card>
            ) : (
              categorizedBookings.current.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="future" className="mt-6">
            {categorizedBookings.future.length === 0 ? (
              <Card>
                <CardContent className="text-center py-6 text-muted-foreground">
                  No upcoming bookings
                </CardContent>
              </Card>
            ) : (
              categorizedBookings.future.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {categorizedBookings.past.length === 0 ? (
              <Card>
                <CardContent className="text-center py-6 text-muted-foreground">
                  No past bookings
                </CardContent>
              </Card>
            ) : (
              categorizedBookings.past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingsPage;