package com.backend.boardMate.controller;

import com.backend.boardMate.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/verify")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    /**
     * Upload and verify identity document (ID/Passport) using Veriff
     */
    @PostMapping(value = "/document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> verifyDocument(
            @RequestParam("userId") String userId,
            @RequestParam("fullName") String fullName,
            @RequestParam("document") MultipartFile document) {

        return verificationService.verifyDocument(userId, fullName, document);
    }

    /**
     * Get document verification status and details
     */
    @GetMapping("/document/status")
    public Map<String, Object> getDocumentStatus(@RequestParam("userId") String userId) {
        Map<String, Object> response = new HashMap<>();

        boolean isVerified = verificationService.isDocumentVerified(userId);
        Map<String, Object> details = verificationService.getDocumentDetails(userId);

        response.put("userId", userId);
        response.put("verified", isVerified);
        response.put("details", details);

        return response;
    }

    /**
     * Send verification code to email or mobile
     */
    @PostMapping("/send-code")
    public Map<String, String> sendVerificationCode(@RequestBody Map<String, String> request) {
        String recipient = request.containsKey("email") ? request.get("email") : request.get("mobile");
        String type = request.containsKey("email") ? "email" : "mobile";

        // Validate recipient
        if (recipient == null || recipient.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Email or mobile number is required");
            return response;
        }

        return verificationService.sendVerificationCode(recipient, type);
    }

    /**
     * Verify code entered by user
     */
    @PostMapping("/check-code")
    public Map<String, String> checkVerificationCode(@RequestBody Map<String, String> request) {
        String recipient = request.containsKey("email") ? request.get("email") : request.get("mobile");
        String code = request.get("code");

        // Validate input
        if (recipient == null || recipient.isEmpty() || code == null || code.isEmpty()) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "Recipient and verification code are required");
            return response;
        }

        return verificationService.verifyCode(recipient, code);
    }
}