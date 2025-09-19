
import { useState, useEffect } from "react";

interface Review {
  reviewer_name: string;
  platform: string;
  Logo?: { url: string }[];
  review_text: string;
  rating: number;
  product?: string;
  review_summary?: string;
}

interface ProductReviewsProps {
  productId?: string;   // Airtable record ID of the product
  productName?: string; // Actual name like "Heavy-Duty Roll-Up Tool Bag"
}

const Reviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAM; // "reviews"

  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId && !productName) {
        setError("No productId or productName provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        let url = "";

        // Try to filter by product name (since product field is linked by name)
        if (productName) {
          url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=({product} = '${productName}')`;
        } else if (productId) {
          url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=({product} = '${productId}')`;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        console.log("Reviews API response:", data);

        if (!data.records || data.records.length === 0) {
          setError("No reviews found for this product.");
        } else {
          setReviews(data.records.map((record: any) => record.fields) as Review[]);
        }
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError(err.message || "Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, productName, baseId, tableName, token]);

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4">Product Reviews</h2>

      {loading && <p className="text-gray-500 animate-pulse">Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              {/* Star Rating */}
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 text-sm line-clamp-4">{review.review_text}</p>

              {/* Reviewer Info */}
              <div className="mt-3 flex items-center gap-2">
                {review.Logo && review.Logo[0]?.url && (
                  <img
                    src={review.Logo[0].url}
                    alt={review.platform}
                    className="w-6 h-6 object-contain"
                  />
                )}
                <span className="text-xs text-gray-500">
                  {review.reviewer_name} • {review.platform}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
