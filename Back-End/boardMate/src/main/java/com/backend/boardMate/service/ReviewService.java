package com.backend.boardMate.service;

import com.backend.boardMate.model.Review;
import com.backend.boardMate.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Add a new review
    public Review addReview(Review review) {
        review.setDate(LocalDate.now()); // Set the current date
        return reviewRepository.save(review);
    }

    // Get all reviews for a property
    public List<Review> getReviewsByPropertyId(Long propertyId) {
        return reviewRepository.findByPropertyId(propertyId);
    }

    // Calculate the average rating for a property
    public double getAverageRating(Long propertyId) {
        List<Review> reviews = reviewRepository.findByPropertyId(propertyId);
        if (reviews.isEmpty()) {
            return 0.0; // No reviews yet
        }
        int totalRating = reviews.stream().mapToInt(Review::getRating).sum();
        return (double) totalRating / reviews.size();
    }
}
