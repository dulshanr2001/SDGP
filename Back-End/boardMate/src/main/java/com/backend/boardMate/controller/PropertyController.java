package com.backend.boardMate.controller;

import com.backend.boardMate.model.Property;
// import com.backend.boardMate.entity.Property;
import com.backend.boardMate.service.PropertyService;
import com.backend.boardMate.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController // Marks this class as a REST controller that handles HTTP requests and responses
@RequestMapping("/api/properties")  // Base URI for all endpoints
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private ImageService imageService;

    @PostMapping
    public Property addProperty(@RequestBody Property property) {
        // Adds a new property using the service layer
        return propertyService.addProperty(property);
    }

    @GetMapping
    public List<Property> getAllProperties() {
        // Retrieves all properties
        return propertyService.getAllProperties();
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable Long id) {
        return propertyService.getPropertyById(id);
    }

    @PutMapping("/{id}")
    public Property updateProperty(@PathVariable Long id, @RequestBody Property property) {
        return propertyService.updateProperty(id, property);
    }

    @DeleteMapping("/{id}")  // DELETE request for specific property ID
    public String deleteProperty(@PathVariable Long id) {
        // Deletes a property by ID
        return "Property with ID " + id + " deleted successfully.";
    }

    @PostMapping(consumes = "multipart/form-data")
    public String uploadProperty(
            @RequestPart("file") MultipartFile file,  // Handles file upload
            @RequestPart("data") Map<String, String> data // Handles other form fields
    ) {
        // Handles multipart form data containing file and additional property details
        return "File uploaded: " + file.getOriginalFilename();
    }

    @GetMapping("/getPropertyList")
    public List<Property> getPropertyList(@RequestParam Integer landlordId) {
        // Retrieves all properties that belong to a specific landlord
        return propertyService.getPropertiesByLandlordId(landlordId);
    }

    @GetMapping("/search")
    public List<Property> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        // Searches properties based on location, type, and price range
        return propertyService.searchProperties(location.toLowerCase(), type, minPrice, maxPrice);
    }

    @PostMapping("/bookATour")
    public Map<String, String> bookATour(@RequestBody Map<String, Object> request) {
        // Handles booking a property tour using student and property IDs
        Integer propertyID = (Integer) request.get("propertyId");
        Integer studentID = (Integer) request.get("studentId");
        String tourDateTime = (String) request.get("tourDateTime");
        propertyService.bookATour(propertyID.longValue(), studentID.longValue(), tourDateTime);
        return Map.of("message", "Tour booked successfully");
    }

    @PostMapping("/upload-images")
    public ResponseEntity<Map<String, Object>> uploadImages(
            @RequestParam("files") MultipartFile[] files) {
        // Uploads multiple image files and stores their references
        try {
            List<String> imageReferences = imageService.storeImages(files);
            Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Images uploaded successfully",
                    "imageReferences", imageReferences
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = Map.of(
                    "success", false,
                    "message", "Failed to upload images: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{propertyId}/add-images")
    public Property addImagesToProperty(
            @PathVariable Long propertyId,
            @RequestBody Map<String, Object> request) {
        // Associates uploaded images with a specific property
        List<String> imageReferences = (List<String>) request.get("imageReferences");
        if (imageReferences == null || imageReferences.isEmpty()) {
            throw new IllegalArgumentException("Image references cannot be null or empty");
        }
        return propertyService.addImagesToProperty(propertyId, imageReferences);
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        // Serves the uploaded image by filename
        Resource file = imageService.loadImageAsResource(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(file);
    }
}