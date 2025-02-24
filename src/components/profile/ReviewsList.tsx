import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number | null;
  comment: string | null;
  created_at: string;
  provider: {
    business_name: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
  showReviews?: boolean;
}

export function ReviewsList({ reviews, isLoading, showReviews = true }: ReviewsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews from Service Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground animate-pulse">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  if (!showReviews) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews from Service Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Reviews are hidden due to privacy settings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews from Service Providers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-border pb-6 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (review.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {review.provider.business_name}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-foreground leading-relaxed">
                    "{review.comment}"
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {format(new Date(review.created_at), "PPP")}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}