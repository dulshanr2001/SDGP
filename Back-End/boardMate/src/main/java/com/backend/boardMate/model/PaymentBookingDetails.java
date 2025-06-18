package com.backend.boardMate.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "payment_booking_details")
public class PaymentBookingDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // User ID for the person making the payment

    @Column(nullable = false)
    private Long propertyId; // Property ID that the user is booking

    @Column(nullable = false)
    private String propertyName; // Name of the property

    @Column(nullable = false)
    private String propertyAddress; // Address of the property

    @Column(nullable = false)
    private String propertyContact; // Contact number of the landlord

    @Column(nullable = false)
    private Double price; // Price of the property for booking

    @Column(nullable = false)
    private LocalDate bookingDate; // Booking date in YYYY-MM-DD format

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public Double getPrice() {
        return price;
    }

    public String getPropertyAddress() {
        return propertyAddress;
    }

    public String getPropertyContact() {
        return propertyContact;
    }

    public Long getPropertyId() {
        return propertyId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getPropertyName() {
        return propertyName;
    }
    // Getters and Setters (Lombok @Data annotation automatically generates these)
}
