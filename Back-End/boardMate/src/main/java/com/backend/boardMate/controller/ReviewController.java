package com.backend.boardMate.controller;

import com.backend.boardMate.model.Review;
import com.backend.boardMate.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties/{propertyId}/reviews")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from Vite frontend
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Get all reviews for a property
    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long propertyId) {
        List<Review> reviews = reviewService.getReviewsByPropertyId(propertyId);
        return ResponseEntity.ok(reviews);
    }

    // Add a new review for a property
    @PostMapping
    public ResponseEntity<Review> addReview(@PathVariable Long propertyId, @RequestBody Review review) {
        review.setPropertyId(propertyId); // Set the property ID
        Review savedReview = reviewService.addReview(review);
        return ResponseEntity.ok(savedReview);
    }

    // Get the average rating for a property
    @GetMapping("/average-rating")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long propertyId) {
        double averageRating = reviewService.getAverageRating(propertyId);
        return ResponseEntity.ok(averageRating);
    }
}