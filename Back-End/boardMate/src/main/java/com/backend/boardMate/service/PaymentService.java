package com.backend.boardMate.service;

import com.backend.boardMate.model.PaymentBookingDetails;
import com.backend.boardMate.repository.PaymentBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentBookingRepository paymentBookingRepository;

    public PaymentBookingDetails savePaymentBooking(PaymentBookingDetails paymentBookingDetails) {
        try {
            // Log the payment details being saved
            System.out.println("Saving payment details: " + paymentBookingDetails);
            return paymentBookingRepository.save(paymentBookingDetails);
        } catch (Exception e) {
            // Log the exception for better debugging
            e.printStackTrace();
            throw new RuntimeException("Failed to save payment booking: " + e.getMessage(), e);
        }
    }

    public List<PaymentBookingDetails> getBookingsByUserId(Long userId) {
        try {
            return paymentBookingRepository.findByUserId(userId);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch bookings by user ID: " + e.getMessage(), e);
        }
    }

    public PaymentBookingDetails getBookingById(Long id) {
        try {
            return paymentBookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch booking by ID: " + e.getMessage(), e);
        }
    }
}