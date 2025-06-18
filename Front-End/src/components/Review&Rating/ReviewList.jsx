import React from 'react';
import './Review&Rating.css';

const ReviewList = ({ reviews }) => {
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-rating">
            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
          </div>
          <div className="review-text">{review.review}</div>
          <div className="review-user">
            - {review.user} <span className="review-date">{review.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;