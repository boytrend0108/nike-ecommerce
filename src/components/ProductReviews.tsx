import { getProductReviews, type ReviewItem } from '@/lib/actions/product';
import { Star } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <div className="border-b border-light-300 pb-6 last:border-b-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-dark-900 text-dark-900'
                  : 'text-light-500'
              }`}
            />
          ))}
        </div>
        <span className="text-body-medium text-dark-900">{review.author}</span>
        <span className="text-caption text-dark-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      {review.title && (
        <h4 className="text-body-medium text-dark-900 mb-2">{review.title}</h4>
      )}
      
      <p className="text-body text-dark-700 leading-relaxed">{review.content}</p>
    </div>
  );
}

export default async function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-body text-dark-500">No reviews yet. Be the first to review this product.</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? 'fill-dark-900 text-dark-900'
                    : 'text-light-500'
                }`}
              />
            ))}
          </div>
          <span className="text-body-medium text-dark-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <span className="text-body text-dark-500">
          ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
        </span>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
