package com.backend.boardMate.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageService {

    // Reads the directory path from application properties for storing images
    @Value("${app.upload.dir}")
    private String uploadDir;

    private Path fileStoragePath;

    // Initializes the storage directory after the bean is created
    @PostConstruct
    public void init() {
        fileStoragePath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(fileStoragePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored", e);
        }
    }

    public List<String> storeImages(MultipartFile[] files) {
        List<String> fileReferences = new ArrayList<>();

        for (MultipartFile file : files) {
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = getFileExtension(originalFileName);
            String fileName = UUID.randomUUID().toString() + fileExtension;

            try {
                // Check if the file's name contains invalid characters
                if (originalFileName.contains("..")) {
                    throw new RuntimeException("Filename contains invalid path sequence " + originalFileName);
                }

                // Copy file to the target location
                Path targetLocation = fileStoragePath.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                fileReferences.add(fileName);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + originalFileName, ex);
            }
        }

        return fileReferences;
    }

    public Resource loadImageAsResource(String fileName) {
        try {
            Path filePath = fileStoragePath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri()); // Convert path to URL-based resource
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
}