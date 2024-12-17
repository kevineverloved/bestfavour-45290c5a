import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, MapPin, CreditCard, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(2);
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { data: provider, isLoading } = useQuery({
    queryKey: ['serviceProvider', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          service_types(
            name,
            category_id,
            service_categories(name)
          )
        `)
        .eq('id', providerId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !address) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here we would typically handle the actual booking process
    toast.success("Booking request sent successfully!");
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const totalCost = provider ? Number(provider.hourly_rate) * duration : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Provider Details */}
        <Card>
          <CardHeader>
            <CardTitle>Service Provider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${providerId}`}
                alt={provider?.business_name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{provider?.business_name}</h2>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.8</span>
                  <span className="text-gray-400">(24 reviews)</span>
                </div>
                <p className="text-lg font-semibold text-primary">
                  R{provider?.hourly_rate}/hour
                </p>
              </div>
            </div>
            <p className="text-gray-600">{provider?.description}</p>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duration (hours)</Label>
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Requirements</Label>
                <Textarea
                  placeholder="Any special instructions or requirements?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Service Rate</span>
                <span>R{provider?.hourly_rate}/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{duration} hours</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>R{totalCost}</span>
              </div>

              <Button 
                className="w-full"
                onClick={handleBooking}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;