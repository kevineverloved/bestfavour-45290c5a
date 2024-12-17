import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

const BookingsPage = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service_providers (
            business_name,
            hourly_rate
          )
        `)
        .order('booking_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading your bookings...</div>;
  }

  if (!bookings?.length) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="pt-6">
            No bookings found. Book a service to get started!
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl font-bold">Your Bookings</h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle>{booking.service_providers.business_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(booking.booking_date), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {booking.booking_time} ({booking.duration} hours)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{booking.address}</span>
              </div>
              {booking.notes && (
                <div className="text-sm text-gray-600">
                  <strong>Notes:</strong> {booking.notes}
                </div>
              )}
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-lg">R{booking.total_amount}</span>
                </div>
                <div className="mt-2">
                  <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {booking.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;