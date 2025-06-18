package com.backend.boardMate.controller;

import com.backend.boardMate.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class VeriffWebhookController {

    @Autowired
    private VerificationService verificationService;

    /**
     * Handle Veriff verification status webhooks
     */
    @PostMapping("/veriff")
    public ResponseEntity<String> handleVeriffWebhook(@RequestBody Map<String, Object> webhookData) {
        // Process webhook data
        verificationService.handleVeriffWebhook(webhookData);

        // Return 200 OK to acknowledge receipt
        return ResponseEntity.ok("Webhook received");
    }
}