package com.backend.boardMate.repository;

import com.backend.boardMate.model.PaymentBookingDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentBookingRepository extends JpaRepository<PaymentBookingDetails, Long> {

    // Find all bookings by user ID
    List<PaymentBookingDetails> findByUserId(Long userId);

    // Find all bookings by property ID
    List<PaymentBookingDetails> findByPropertyId(Long propertyId);

    // Find bookings by both user ID and property ID
    List<PaymentBookingDetails> findByUserIdAndPropertyId(Long userId, Long propertyId);

    // Check if a booking exists for a user and property
    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);
}