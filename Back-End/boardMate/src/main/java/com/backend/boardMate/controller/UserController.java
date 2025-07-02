package com.backend.boardMate.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.boardMate.model.Property;
import com.backend.boardMate.model.User;
import com.backend.boardMate.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getByEmail")
    public User getUserByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Add property to favorites
    @PostMapping("/{userId}/favorites/{propertyId}")
    public ResponseEntity<Map<String, Object>> addToFavorites(
            @PathVariable Long userId,
            @PathVariable Long propertyId) {
        try {
            boolean added = userService.addToFavorites(userId, propertyId);
            if (added) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Property added to favorites successfully",
                        "isFavorite", true
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Property is already in favorites",
                        "isFavorite", true
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to add to favorites: " + e.getMessage()
            ));
        }
    }

    // Remove property from favorites
    @DeleteMapping("/{userId}/favorites/{propertyId}")
    public ResponseEntity<Map<String, Object>> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable Long propertyId) {
        try {
            boolean removed = userService.removeFromFavorites(userId, propertyId);
            if (removed) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Property removed from favorites successfully",
                        "isFavorite", false
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                        "success", false,
                        "message", "Property is not in favorites",
                        "isFavorite", false
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to remove from favorites: " + e.getMessage()
            ));
        }
    }

    // Toggle favorite status
    @PostMapping("/{userId}/favorites/{propertyId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @PathVariable Long userId,
            @PathVariable Long propertyId) {
        try {
            boolean isFavorite = userService.toggleFavorite(userId, propertyId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isFavorite", isFavorite,
                    "message", isFavorite ? "Property added to favorites" : "Property removed from favorites"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to toggle favorite: " + e.getMessage()
            ));
        }
    }

    // Get user's favorite properties
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Property>> getFavoriteProperties(@PathVariable Long userId) {
        try {
            List<Property> favorites = userService.getFavoriteProperties(userId);
            return ResponseEntity.ok(favorites);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Check if a property is in user's favorites
    @GetMapping("/{userId}/favorites/{propertyId}/check")
    public ResponseEntity<Map<String, Object>> checkFavoriteStatus(
            @PathVariable Long userId,
            @PathVariable Long propertyId) {
        try {
            boolean isFavorite = userService.isPropertyInFavorites(userId, propertyId);
            return ResponseEntity.ok(Map.of(
                    "isFavorite", isFavorite,
                    "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "isFavorite", false,
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}