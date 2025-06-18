package com.backend.boardMate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationService {

    // Store verification codes with user identifiers (email or mobile)
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    // Store document verification statuses
    private final Map<String, Boolean> documentVerificationStatus = new ConcurrentHashMap<>();

    // Store document metadata and verification results
    private final Map<String, Map<String, Object>> documentDetails = new ConcurrentHashMap<>();

    @Value("${document.storage.local-path}")
    private String localStoragePath;

    // Veriff API configuration
    @Value("${veriff.api.base-url}")
    private String veriffApiBaseUrl;

    @Value("${veriff.api.public-key}")
    private String veriffApiPublicKey;

    @Value("${veriff.api.private-key}")
    private String veriffApiPrivateKey;

    /**
     * Process and store document for verification using Veriff
     */
    public Map<String, String> verifyDocument(String userId, String fullName, MultipartFile document) {
        Map<String, String> response = new HashMap<>();

        // Check if document is valid (not empty)
        if (document.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Document file is empty");
            return response;
        }

        try {
            // 1. Save the document to a secure location locally
            String documentPath = saveDocumentLocally(userId, document);

            // 2. Call Veriff API to verify the document
            Map<String, Object> verificationResult = verifyDocumentWithVeriff(documentPath, userId, fullName);

            // 3. Store the verification result
            boolean isVerified = (boolean) verificationResult.get("isVerified");
            documentVerificationStatus.put(userId, isVerified);

            // Store additional details
            documentDetails.put(userId, new HashMap<>());
            documentDetails.get(userId).put("localPath", documentPath);
            documentDetails.get(userId).put("verificationDetails", verificationResult);
            documentDetails.get(userId).put("timestamp", System.currentTimeMillis());

            if (isVerified) {
                response.put("status", "success");
                response.put("message", "Document verified successfully");
            } else {
                response.put("status", "error");
                response.put("message", "Document verification failed: " + verificationResult.get("reason"));
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to process document: " + e.getMessage());
        }

        return response;
    }

    /**
     * Save the uploaded document to a secure local location
     */
    private String saveDocumentLocally(String userId, MultipartFile document) throws IOException {
        // Create directory if it doesn't exist
        java.io.File directory = new java.io.File(localStoragePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate a unique filename
        String originalFilename = document.getOriginalFilename();
        String fileExtension = originalFilename != null ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".pdf";
        String filename = userId + "_" + UUID.randomUUID().toString() + fileExtension;

        // Create the file path
        Path filepath = Paths.get(localStoragePath, filename);

        // Save the file
        Files.write(filepath, document.getBytes());

        return filepath.toString();
    }

    /**
     * Verify document using Veriff API
     */
    private Map<String, Object> verifyDocumentWithVeriff(String filePath, String userId, String fullName) throws IOException {
        Map<String, Object> result = new HashMap<>();
        RestTemplate restTemplate = new RestTemplate();

        try {
            // Read the file content
            byte[] fileContent = Files.readAllBytes(Paths.get(filePath));

            // 1. Create a verification session with Veriff
            String sessionUrl = veriffApiBaseUrl + "/sessions";

            HttpHeaders sessionHeaders = new HttpHeaders();
            sessionHeaders.setContentType(MediaType.APPLICATION_JSON);
            sessionHeaders.set("X-AUTH-CLIENT", veriffApiPublicKey);

            // Create session request body
            Map<String, Object> sessionRequest = new HashMap<>();
            sessionRequest.put("verification", createVerificationRequest(userId, fullName));

            HttpEntity<Map<String, Object>> sessionEntity = new HttpEntity<>(sessionRequest, sessionHeaders);

            ResponseEntity<Map> sessionResponse = restTemplate.exchange(
                    sessionUrl,
                    HttpMethod.POST,
                    sessionEntity,
                    Map.class
            );

            if (sessionResponse.getStatusCode().is2xxSuccessful() && sessionResponse.getBody() != null) {
                Map<String, Object> sessionData = sessionResponse.getBody();
                String sessionId = (String) ((Map<String, Object>) sessionData.get("verification")).get("id");

                // 2. Upload the document to the verification session
                String uploadUrl = veriffApiBaseUrl + "/sessions/" + sessionId + "/media";

                HttpHeaders uploadHeaders = new HttpHeaders();
                uploadHeaders.setContentType(MediaType.valueOf(determineMimeType(filePath)));
                uploadHeaders.set("X-AUTH-CLIENT", veriffApiPublicKey);

                HttpEntity<byte[]> uploadEntity = new HttpEntity<>(fileContent, uploadHeaders);

                ResponseEntity<Map> uploadResponse = restTemplate.exchange(
                        uploadUrl,
                        HttpMethod.POST,
                        uploadEntity,
                        Map.class
                );

                // 3. Submit the verification for processing
                String submitUrl = veriffApiBaseUrl + "/sessions/" + sessionId + "/submit";

                HttpHeaders submitHeaders = new HttpHeaders();
                submitHeaders.setContentType(MediaType.APPLICATION_JSON);
                submitHeaders.set("X-AUTH-CLIENT", veriffApiPublicKey);

                HttpEntity<String> submitEntity = new HttpEntity<>("{}", submitHeaders);

                ResponseEntity<Map> submitResponse = restTemplate.exchange(
                        submitUrl,
                        HttpMethod.POST,
                        submitEntity,
                        Map.class
                );

                // 4. Check the verification decision (in a real implementation, this would be handled via webhooks)
                // For this example, we'll simulate checking the status

                // Wait a short time for processing (this is just for demonstration)
                Thread.sleep(2000);

                String decisionUrl = veriffApiBaseUrl + "/sessions/" + sessionId + "/decision";

                HttpHeaders decisionHeaders = new HttpHeaders();
                decisionHeaders.set("X-AUTH-CLIENT", veriffApiPublicKey);

                HttpEntity<String> decisionEntity = new HttpEntity<>(null, decisionHeaders);

                ResponseEntity<Map> decisionResponse = restTemplate.exchange(
                        decisionUrl,
                        HttpMethod.GET,
                        decisionEntity,
                        Map.class
                );

                if (decisionResponse.getStatusCode().is2xxSuccessful() && decisionResponse.getBody() != null) {
                    Map<String, Object> decisionData = decisionResponse.getBody();
                    String status = (String) ((Map<String, Object>) decisionData.get("verification")).get("status");

                    // Based on the Veriff decision, set the verification result
                    if ("approved".equals(status)) {
                        result.put("isVerified", true);
                        result.put("sessionId", sessionId);
                        result.put("verificationData", decisionData);
                    } else {
                        result.put("isVerified", false);
                        result.put("reason", "Document verification failed: " + status);
                        result.put("sessionId", sessionId);
                    }
                } else {
                    result.put("isVerified", false);
                    result.put("reason", "Failed to get verification decision");
                }
            } else {
                result.put("isVerified", false);
                result.put("reason", "Failed to create verification session");
            }
        } catch (Exception e) {
            result.put("isVerified", false);
            result.put("reason", "Error during document verification: " + e.getMessage());
        }

        return result;
    }

    /**
     * Create a verification request for Veriff
     */
    private Map<String, Object> createVerificationRequest(String userId, String fullName) {
        Map<String, Object> verification = new HashMap<>();

        // Split full name into first and last name
        String[] nameParts = fullName.split(" ", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        // Create person object
        Map<String, String> person = new HashMap<>();
        person.put("firstName", firstName);
        person.put("lastName", lastName);

        // Create document object
        Map<String, String> document = new HashMap<>();
        document.put("type", "PASSPORT"); // Or ID_CARD, DRIVERS_LICENSE depending on your needs
        document.put("country", "GBR"); // Default to UK, can be parameterized

        // Create callback object
        Map<String, String> callback = new HashMap<>();
        callback.put("webhook", "https://yourdomain.com/api/webhooks/veriff"); // Your webhook endpoint

        // Add all to verification request
        verification.put("person", person);
        verification.put("document", document);
        verification.put("callback", callback);
        verification.put("vendorData", userId); // Use userId as vendor reference

        return verification;
    }

    /**
     * Determine the MIME type based on file extension
     */
    private String determineMimeType(String filePath) {
        if (filePath.toLowerCase().endsWith(".pdf")) {
            return "application/pdf";
        } else if (filePath.toLowerCase().endsWith(".jpg") || filePath.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filePath.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else {
            return "application/octet-stream";
        }
    }

    /**
     * Generate and send verification code to user's email or mobile
     */
    public Map<String, String> sendVerificationCode(String recipient, String type) {
        Map<String, String> response = new HashMap<>();

        // Generate a random 6-digit code
        String verificationCode = String.format("%06d", new Random().nextInt(999999));

        // Store the code with the recipient
        verificationCodes.put(recipient, verificationCode);

        // In a real implementation, you would send the code via email or SMS
        // For this demo, we'll just simulate sending

        response.put("status", "success");
        response.put("message", "Verification code sent to " + type);

        return response;
    }

    /**
     * Verify the code entered by the user
     */
    public Map<String, String> verifyCode(String recipient, String code) {
        Map<String, String> response = new HashMap<>();

        // Check if a verification code exists for the recipient
        if (!verificationCodes.containsKey(recipient)) {
            response.put("status", "error");
            response.put("message", "No verification code found for this recipient");
            return response;
        }

        // Check if the code matches
        if (verificationCodes.get(recipient).equals(code)) {
            response.put("status", "success");
            response.put("message", "Verification successful");

            // Remove the code after successful verification
            verificationCodes.remove(recipient);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid verification code");
        }

        return response;
    }

    /**
     * Handle webhooks from Veriff
     */
    public void handleVeriffWebhook(Map<String, Object> webhookData) {
        try {
            // Extract verification ID from webhook data
            String verificationId = (String) ((Map<String, Object>) webhookData.get("verification")).get("id");

            // Extract status from webhook data
            String status = (String) ((Map<String, Object>) webhookData.get("verification")).get("status");

            // Extract vendorData (userId) from webhook data
            String userId = (String) ((Map<String, Object>) webhookData.get("verification")).get("vendorData");

            // Update verification status based on webhook data
            if ("approved".equals(status)) {
                documentVerificationStatus.put(userId, true);

                // Update document details
                if (!documentDetails.containsKey(userId)) {
                    documentDetails.put(userId, new HashMap<>());
                }

                documentDetails.get(userId).put("verificationId", verificationId);
                documentDetails.get(userId).put("status", status);
                documentDetails.get(userId).put("verificationData", webhookData);
                documentDetails.get(userId).put("verifiedAt", System.currentTimeMillis());
            } else {
                documentVerificationStatus.put(userId, false);

                if (!documentDetails.containsKey(userId)) {
                    documentDetails.put(userId, new HashMap<>());
                }

                documentDetails.get(userId).put("verificationId", verificationId);
                documentDetails.get(userId).put("status", status);
                documentDetails.get(userId).put("verificationData", webhookData);
                documentDetails.get(userId).put("updatedAt", System.currentTimeMillis());
            }

            // Additional processing could be done here

        } catch (Exception e) {
            // Log error
            System.err.println("Error processing Veriff webhook: " + e.getMessage());
        }
    }

    /**
     * Check if a user's document has been verified
     */
    public boolean isDocumentVerified(String userId) {
        return documentVerificationStatus.getOrDefault(userId, false);
    }

    /**
     * Get document verification details for a user
     */
    public Map<String, Object> getDocumentDetails(String userId) {
        return documentDetails.getOrDefault(userId, new HashMap<>());
    }
}