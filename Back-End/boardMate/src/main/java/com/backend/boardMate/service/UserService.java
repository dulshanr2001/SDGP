package com.backend.boardMate.service;

import com.backend.boardMate.model.Property;
import com.backend.boardMate.model.User;
import com.backend.boardMate.repository.PropertyRepository;
import com.backend.boardMate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private VerificationService verificationService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(String email, String password, String firstName, String lastName, String mobile,
                             String day, String month, String year, String userType) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Encrypt password
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setMobile(mobile);
        user.setDateOfBirthDay(day);
        user.setDateOfBirthMonth(month);
        user.setDateOfBirthYear(year);
        user.setUserType(userType);
        return user;
    }

    public User registerStudent(String email, String password, String firstName, String lastName, String mobile,
                                String day, String month, String year, String university, String universityId) {
        // Register the student
        User student = registerUser(email, password, firstName, lastName, mobile, day, month, year, "STUDENT");
        // Additional student-specific settings could be added here
        student.setUniversity(university);
        student.setUniversityId(universityId);
        return userRepository.save(student);
    }

    public User registerLandlord(String email, String password, String firstName, String lastName, String mobile,
                                 String day, String month, String year, boolean isVerified) {
        // Check if verification is required
        if (!isVerified) {
            throw new RuntimeException("Landlord must be verified before registration");
        }
        // Create the user as a landlord
        User landlord = registerUser(email, password, firstName, lastName, mobile, day, month, year, "LANDLORD");
        // Additional landlord-specific settings could be added here
        return userRepository.save(landlord);
    }

    public boolean authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword());
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        return user;
    }

    public User getUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        return user;
    }

    // Favorites functionality
    public boolean addToFavorites(Long userId, Long propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if property exists
        if (!propertyRepository.existsById(propertyId)) {
            throw new RuntimeException("Property not found");
        }

        List<String> favoriteIds = getFavoriteIdsList(user);
        String propertyIdStr = propertyId.toString();

        // Check if already in favorites
        if (favoriteIds.contains(propertyIdStr)) {
            return false; // Already in favorites
        }

        favoriteIds.add(propertyIdStr);
        user.setFavouriteItems(String.join(",", favoriteIds));
        userRepository.save(user);
        return true;
    }

    public boolean removeFromFavorites(Long userId, Long propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> favoriteIds = getFavoriteIdsList(user);
        String propertyIdStr = propertyId.toString();

        boolean removed = favoriteIds.remove(propertyIdStr);
        if (removed) {
            user.setFavouriteItems(favoriteIds.isEmpty() ? null : String.join(",", favoriteIds));
            userRepository.save(user);
        }
        return removed;
    }

    public boolean toggleFavorite(Long userId, Long propertyId) {
        if (isPropertyInFavorites(userId, propertyId)) {
            removeFromFavorites(userId, propertyId);
            return false;
        } else {
            addToFavorites(userId, propertyId);
            return true;
        }
    }

    public boolean isPropertyInFavorites(Long userId, Long propertyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> favoriteIds = getFavoriteIdsList(user);
        return favoriteIds.contains(propertyId.toString());
    }

    public List<Property> getFavoriteProperties(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> favoriteIds = getFavoriteIdsList(user);

        if (favoriteIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Convert string IDs to Long and fetch properties
        List<Long> propertyIds = favoriteIds.stream()
                .filter(id -> !id.trim().isEmpty()) // Filter out empty strings
                .map(Long::parseLong)
                .collect(Collectors.toList());

        return propertyRepository.findAllById(propertyIds);
    }

    private List<String> getFavoriteIdsList(User user) {
        String favoriteItems = user.getFavouriteItems();
        if (favoriteItems == null || favoriteItems.trim().isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(favoriteItems.split(",")));
    }
}