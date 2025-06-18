import React, { useState } from 'react';
import ReactStars from 'react-stars';
import './Review&Rating.css';

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reviewText || rating === 0) {
      alert('Please provide a rating and review text.');
      return;
    }
    onSubmit({ rating, review: reviewText });
    setRating(0);
    setReviewText('');
  };

  return (
    <div className="review-form">
      <h3>Leave a Review</h3>
      <ReactStars
        count={5}
        value={rating}
        onChange={setRating}
        size={24}
        color2={'#ffd700'}
      />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <button onClick={handleSubmit}>Submit Review</button>
    </div>
  );
};

export default ReviewForm;