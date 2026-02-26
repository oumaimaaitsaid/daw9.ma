package com.daw9.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String subFolder) {
        try {
            Path uploadPath = Paths.get(uploadDir, subFolder);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFilename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(newFilename);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            log.info("Fichier stocké: {}", filePath);

            return "/uploads/" + subFolder + "/" + newFilename;

        } catch (IOException e) {
            log.error("Erreur lors du stockage du fichier: {}", e.getMessage());
            throw new RuntimeException("Impossible de stocker le fichier", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl == null || fileUrl.isEmpty())
                return;

            String relativePath = fileUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir, relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Fichier supprimé: {}", filePath);
            }

        } catch (IOException e) {
            log.error("Erreur lors de la suppression du fichier: {}", e.getMessage());
        }
    }

    public byte[] readFile(String fileUrl) {
        try {
            String relativePath = fileUrl.replace("/uploads/", "");
            Path filePath = Paths.get(uploadDir, relativePath);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Erreur lors de la lecture du fichier: {}", e.getMessage());
            throw new RuntimeException("Impossible de lire le fichier", e);
        }
    }
}
