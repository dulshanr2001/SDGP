package com.backend.boardMate.controller;

import com.backend.boardMate.model.PaymentBookingDetails;
import com.backend.boardMate.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Endpoint to handle payment and booking data
    @PostMapping

    public ResponseEntity<?> savePaymentDetails(@RequestBody PaymentBookingDetails paymentBookingDetails) {
        try {
            System.out.println("Received Payment Data: " + paymentBookingDetails);
            System.out.println("Booking Date: " + paymentBookingDetails.getBookingDate());
            System.out.println("Price: " + paymentBookingDetails.getPrice());
            System.out.println("Property Address: " + paymentBookingDetails.getPropertyAddress());
            System.out.println("Property Contact: " + paymentBookingDetails.getPropertyContact());
            System.out.println("Property ID: " + paymentBookingDetails.getPropertyId());
            System.out.println("Property Name: " + paymentBookingDetails.getPropertyName());
            System.out.println("User Id: " + paymentBookingDetails.getUserId());

            if (paymentBookingDetails.getBookingDate() == null) {
                return ResponseEntity.badRequest().body("Booking date cannot be null!");
            }

            // Save the payment and booking details in the database
            PaymentBookingDetails savedDetails = paymentService.savePaymentBooking(paymentBookingDetails);
            return ResponseEntity.status(HttpStatus.OK).body(savedDetails);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save payment and booking details: " + e.getMessage());
        }
    }

    // Endpoint to get all bookings for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsByUser(@PathVariable Long userId) {
        try {
            List<PaymentBookingDetails> bookings = paymentService.getBookingsByUserId(userId);
            if (bookings.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No bookings found for user with ID: " + userId);
            }
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch bookings: " + e.getMessage());
        }
    }

    // Endpoint to get a specific booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            PaymentBookingDetails booking = paymentService.getBookingById(id);
            if (booking == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Booking not found with ID: " + id);
            }
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch booking: " + e.getMessage());
        }
    }
}
