package com.backend.boardMate.controller;

import org.springframework.web.bind.annotation.RestController;

import com.backend.boardMate.model.Property;
import com.backend.boardMate.repository.PropertyRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/dialog-flow")
public class DialogflowWebhookController {

    @Autowired
    private PropertyRepository propertyRepository;

    @SuppressWarnings("unchecked")
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> request) {
        // Extract intent and parameters from the request
        Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
        Map<String, Object> parameters = (Map<String, Object>) queryResult.get("parameters");

        String location = (String) parameters.get("location");
        String priceLower = parameters.get("price-lower") != null ? parameters.get("price-lower").toString() : null;
        String priceHigher = parameters.get("price-higher") != null ? parameters.get("price-higher").toString() : null;

        // Convert string price values to Double, handling null or empty values
        Double minPrice = null;
        Double maxPrice = null;

        if (priceLower != null && !priceLower.isEmpty()) {
            try {
                minPrice = Double.parseDouble(priceLower.trim());
            } catch (NumberFormatException e) {
                // If parsing fails, leave as null
            }
        }

        if (priceHigher != null && !priceHigher.isEmpty()) {
            try {
                maxPrice = Double.parseDouble(priceHigher.trim());
            } catch (NumberFormatException e) {
                // If parsing fails, leave as null
            }
        }

        // Search for properties
        List<Property> searchResults = propertyRepository.searchByLocationAndPriceRange(location, minPrice, maxPrice);

        // Create simple response to ensure timely return
        Map<String, Object> response = new HashMap<>();

        // Build response text
        String responseText;
        if (searchResults.isEmpty()) {
            responseText = "Sorry, I couldn't find any matching rooming places.";
        } else {
            StringBuilder sb = new StringBuilder("Here are a few suggestions:\n");
            for (int i = 0; i < Math.min(3, searchResults.size()); i++) {
                Property place = searchResults.get(i);
                sb.append(String.format("%d. %s - %s (Price: %s)\n",
                        i + 1, place.getTitle(), place.getLocation(), place.getPrice()));
            }
            if (searchResults.size() > 3) {
                sb.append("...and more. Ask me to see more options.");
            }
            responseText = sb.toString();
        }

        response.put("fulfillmentText", responseText);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/test-webhook")
    public ResponseEntity<?> handleTestWebhook(@RequestBody Map<String, Object> request) {
        Map<String, Object> queryResult = (Map<String, Object>) request.get("queryResult");
        Map<String, Object> parameters = (Map<String, Object>) queryResult.get("parameters");

        String location = (String) parameters.get("location");
        String priceLower = parameters.get("price-lower") != null ? parameters.get("price-lower").toString() : null;
        String priceHigher = parameters.get("price-higher") != null ? parameters.get("price-higher").toString() : null;

        // Convert string price values to Double, handling null or empty values
        Double minPrice = null;
        Double maxPrice = null;

        if (priceLower != null && !priceLower.isEmpty()) {
            try {
                minPrice = Double.parseDouble(priceLower.trim());
            } catch (NumberFormatException e) {
                // If parsing fails, leave as null
            }
        }

        if (priceHigher != null && !priceHigher.isEmpty()) {
            try {
                maxPrice = Double.parseDouble(priceHigher.trim());
            } catch (NumberFormatException e) {
                // If parsing fails, leave as null
            }
        }

        // Search for properties
        List<Property> searchResults = propertyRepository.searchByLocationAndPriceRange(location, minPrice, maxPrice);
        // Send a test message without any processing
        Map<String, Object> response = new HashMap<>();
        // response.put("fulfillmentText", "This is a test response from the webhook.");
        // Build response text
        String responseText;
        if (searchResults.isEmpty()) {
            responseText = "Sorry, I couldn't find any matching rooming places.";
        } else {
            StringBuilder sb = new StringBuilder("Here are a few suggestions:\n");
            for (int i = 0; i < Math.min(3, searchResults.size()); i++) {
                Property place = searchResults.get(i);
                sb.append(String.format("%d. %s - %s (Price: %s)\n",
                        i + 1, place.getTitle(), place.getLocation(), place.getPrice()));
            }
            if (searchResults.size() > 3) {
                sb.append("...and more. Ask me to see more options.");
            }
            responseText = sb.toString();
        }

        response.put("fulfillmentText", responseText);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> formatDialogflowResponse(List<Property> places) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> fulfillmentMessages = new ArrayList<>();

        // Build response text
        String responseText;
        if (places.isEmpty()) {
            responseText = "Sorry, I couldn't find any matching rooming places.";
        } else {
            StringBuilder sb = new StringBuilder("Here are a few suggestions:\n");
            for (int i = 0; i < Math.min(3, places.size()); i++) {
                Property place = places.get(i);
                sb.append(String.format("%d. %s - %s (Price: %s)\n",
                        i + 1, place.getTitle(), place.getLocation(), place.getPrice()));
            }
            if (places.size() > 3) {
                sb.append("...and more. Ask me to see more options.");
            }
            responseText = sb.toString();
        }

        // Create text response object with the exact structure needed
        Map<String, Object> textObj = new HashMap<>();
        textObj.put("text", Collections.singletonList(responseText));

        // Create message object
        Map<String, Object> message = new HashMap<>();
        message.put("text", textObj);

        // Add message to fulfillment messages
        fulfillmentMessages.add(message);

        // Set fulfillment messages in response
        response.put("fulfillmentMessages", fulfillmentMessages);
        return response;
    }
}