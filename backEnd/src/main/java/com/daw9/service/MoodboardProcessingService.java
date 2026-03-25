package com.daw9.service;

import com.daw9.model.MoodboardImage;
import com.daw9.model.StyleProfile;
import com.daw9.model.enums.CategoriePrestataire;
import com.daw9.repository.ClientRepository;
import com.daw9.repository.MoodboardImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoodboardProcessingService {

    private final ImageAnalysisService imageAnalysisService;
    private final MoodboardImageRepository moodboardImageRepository;
    private final ClientRepository clientRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Async
    public void analyzeAsync(Long imageId, byte[] imageData, Long clientId) {
        MoodboardImage img = moodboardImageRepository.findById(imageId).orElse(null);
        if (img == null)
            return;

        try {
            var classification = imageAnalysisService.classifyImage(imageData);
            img.setCategorie(classification.categorie());
            img.setSousCategorie(classification.sousCategorie());
            img.setConfidence(classification.confidence());

            var styleResult = imageAnalysisService.analyzeImage(imageData);
            img.setCouleurDominante(styleResult.couleurDominante());
            img.setStyle(styleResult.styleProfile().getStyle());
            img.setPalette(styleResult.styleProfile().getPalette());
            img.setAmbiance(styleResult.styleProfile().getAmbiance());
            img.setBudgetPercu(styleResult.styleProfile().getBudgetPercu());

            img.setAnalysisStatus("DONE");
            log.info("Analysis [DONE] for image {}: {}/{}", imageId, classification.categorie(),
                    classification.sousCategorie());

        } catch (Exception e) {
            img.setAnalysisStatus("FAILED");
            log.error("Analysis [FAILED] for image {}: {}", imageId, e.getMessage(), e);
        }

        moodboardImageRepository.save(img);
        updateClientProfile(clientId);

        messagingTemplate.convertAndSend("/topic/moodboard/" + clientId, img);
    }

    private void updateClientProfile(Long clientId) {
        List<MoodboardImage> images = moodboardImageRepository.findByClientId(clientId);
        List<StyleProfile> profiles = images.stream()
                .map(img -> {
                    if (img.getStyle() == null)
                        return null;
                    return new StyleProfile(img.getStyle(), img.getPalette(), img.getAmbiance(), img.getBudgetPercu());
                })
                .filter(p -> p != null)
                .toList();

        if (profiles.isEmpty())
            return;

        clientRepository.findById(clientId).ifPresent(client -> {
            client.setStyleProfile(imageAnalysisService.calculateAverageProfile(profiles));
            clientRepository.save(client);
        });
    }
}
