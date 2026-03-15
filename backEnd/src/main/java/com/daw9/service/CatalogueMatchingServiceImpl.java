package com.daw9.service;

import com.daw9.model.CatalogueItem;
import com.daw9.model.MoodboardImage;
import com.daw9.model.StyleProfile;
import com.daw9.model.enums.*;
import com.daw9.repository.CatalogueItemRepository;
import com.daw9.repository.MoodboardImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatalogueMatchingServiceImpl implements CatalogueMatchingService {

    private final CatalogueItemRepository catalogueItemRepository;
    private final MoodboardImageRepository moodboardRepo;

    private static final Set<String> TENUES_SOUS_CATEGORIES = Set.of(
            "caftan", "takchita", "lebsa", "robe-moderne", "jabador", "costume"
    );

    public Map<String, Object> getSuggestions(Long clientId) {
        List<MoodboardImage> images = moodboardRepo.findByClientId(clientId);
        Map<String, Object> result = new HashMap<>();

        if (images.isEmpty()) {
            log.info("Aucune image dans le moodboard du client {}", clientId);
            return result;
        }

        // Grouper par sous-catégorie
        Map<String, List<MoodboardImage>> bySousCategorie = images.stream()
                .filter(img -> img.getSousCategorie() != null)
                .collect(Collectors.groupingBy(MoodboardImage::getSousCategorie));

        log.info("Client {} - Images groupées par sous-catégorie: {}", clientId, bySousCategorie.keySet());

        for (Map.Entry<String, List<MoodboardImage>> entry : bySousCategorie.entrySet()) {
            String sousCategorie = entry.getKey();
            List<MoodboardImage> imagesForSousCategorie = entry.getValue();

            // Calculer le profil moyen pour cette sous-catégorie
            StyleProfile subProfile = calculateAverageProfile(imagesForSousCategorie);
            String couleurClient = getCouleurDominante(imagesForSousCategorie);

            // Matcher en utilisant le profil spécifique ou le profil global del client
            List<CatalogueItem> items = findMatchingItems(sousCategorie, imagesForSousCategorie.get(0).getCategorie(), couleurClient, subProfile);
            result.put(sousCategorie, items);
            
            log.info("Matching '{}': {} articles trouvés (couleur={}, profile={})",
                    sousCategorie, items.size(), couleurClient, subProfile != null ? "SPECIFIC" : "NONE");
        }

        return result;
    }

    /**
     * Extrait la couleur dominante des images du client
     */
    private String getCouleurDominante(List<MoodboardImage> images) {
        return images.stream()
                .map(MoodboardImage::getCouleurDominante)
                .filter(Objects::nonNull)
                .filter(c -> !c.isBlank())
                .findFirst()
                .map(String::toLowerCase)
                .orElse(null);
    }

    /**
     * Trouve les articles de la sous-catégorie donnée, triés par score de similarité (Style + Couleur).
     * Si aucun article n'est trouvé en sous-catégorie, fallback sur la catégorie globale.
     */
    private List<CatalogueItem> findMatchingItems(String sousCategorie, CategoriePrestataire categorie, String couleurClient,
            StyleProfile clientProfile) {
        
        List<CatalogueItem> items = catalogueItemRepository.findBySousCategorie(sousCategorie, org.springframework.data.domain.Pageable.unpaged()).getContent();

        // FALLBACK: Si vide, chercher par catégorie
        if (items.isEmpty() && categorie != null) {
            log.info("Aucun article trouvé pour la sous-catégorie '{}'. Fallback sur la catégorie '{}'.", sousCategorie, categorie);
            items = catalogueItemRepository.findByCategorie(categorie.name(), org.springframework.data.domain.Pageable.unpaged()).getContent();
        }

        if (items.isEmpty()) {
            return items;
        }

        // STRICT COLOR FILTERING pour les tenues (comme demandé par le client)
        if (TENUES_SOUS_CATEGORIES.contains(sousCategorie) && couleurClient != null && !couleurClient.isBlank()) {
            List<CatalogueItem> filtered = items.stream()
                    .filter(item -> matchesCouleur(item.getCouleurDominante(), couleurClient))
                    .collect(Collectors.toList());
            
            if (!filtered.isEmpty()) {
                log.info("Filtrage couleur STRICT pour '{}': {} -> {} articles", sousCategorie, items.size(), filtered.size());
                items = filtered;
            } else {
                log.info("Aucun article ne matche la couleur '{}' pour '{}', on garde la liste complete (non strict fallback)", couleurClient, sousCategorie);
            }
        }

        // Trier par score de similarité (StyleProfile + Couleur bonus)
        return items.stream()
                .map(item -> new ItemWithScore(item, calculateSimilarityScore(item, clientProfile, couleurClient)))
                .sorted((a, b) -> Integer.compare(b.score, a.score))
                .peek(iws -> log.debug("Item Match: {} (Score: {})", iws.item.getNom(), iws.score))
                .map(iws -> iws.item)
                .limit(6)
                .collect(Collectors.toList());
    }

    /**
     * Vérifie si la couleur de l'item correspond à celle du client
     */
    private boolean matchesCouleur(String couleurItem, String couleurClient) {
        if (couleurItem == null || couleurItem.isBlank()) {
            return false;
        }
        String ci = couleurItem.toLowerCase().trim();
        String cc = couleurClient.toLowerCase().trim();

        // Correspondance exacte ou partielle
        return ci.equals(cc) || ci.contains(cc) || cc.contains(ci);
    }

    /**
     * Calcule le score de similarité entre une tenue et le profil du client
     */
    private int calculateSimilarityScore(CatalogueItem item, StyleProfile clientProfile, String couleurClient) {
        int score = 0;
        
        // Bonus si la couleur matche (+40 pts car c'est tres important pour les tenues)
        if (matchesCouleur(item.getCouleurDominante(), couleurClient)) {
            score += 40;
        }

        if (clientProfile == null) {
            return score + (item.getImages() != null && !item.getImages().isEmpty() ? 5 : 0);
        }

        StyleProfile itemProfile = new StyleProfile(
                item.getStyle(), 
                item.getPalette(), 
                item.getAmbiance(), 
                item.getBudgetPercu()
            );
        if (itemProfile.getStyle() == null && itemProfile.getPalette() == null && itemProfile.getAmbiance() == null && itemProfile.getBudgetPercu() == null) {
            return score + (item.getImages() != null && !item.getImages().isEmpty() ? 5 : 0);
        }

        // Style identique = +30 pts
        if (clientProfile.getStyle() != null && clientProfile.getStyle().equals(itemProfile.getStyle())) {
            score += 30;
        }

        // Palette identique = +25 pts
        if (clientProfile.getPalette() != null && clientProfile.getPalette().equals(itemProfile.getPalette())) {
            score += 25;
        }

        // Ambiance identique = +20 pts
        if (clientProfile.getAmbiance() != null && clientProfile.getAmbiance().equals(itemProfile.getAmbiance())) {
            score += 20;
        }

        // Budget similaire = +15 pts
        if (clientProfile.getBudgetPercu() != null
                && clientProfile.getBudgetPercu().equals(itemProfile.getBudgetPercu())) {
            score += 15;
        }

        // Bonus si l'article a des images (+3 pts)
        if (item.getImages() != null && !item.getImages().isEmpty()) {
            score += 3;
        }

        return score;
    }

    private StyleProfile calculateAverageProfile(List<MoodboardImage> images) {
        List<StyleProfile> profiles = images.stream()
                .map(img -> {
                    if (img.getStyle() == null) return null;
                    return new StyleProfile(img.getStyle(), img.getPalette(), img.getAmbiance(), img.getBudgetPercu());
                })
                .filter(Objects::nonNull)
                .toList();

        if (profiles.isEmpty())
            return null;

        Map<String, Integer> styleCounts = new HashMap<>();
        Map<String, Integer> paletteCounts = new HashMap<>();
        Map<String, Integer> ambianceCounts = new HashMap<>();
        Map<String, Integer> budgetCounts = new HashMap<>();

        for (MoodboardImage img : images) {
            if (img.getStyle() != null)
                styleCounts.merge(img.getStyle().name(), 1, Integer::sum);
            if (img.getPalette() != null)
                paletteCounts.merge(img.getPalette().name(), 1, Integer::sum);
            if (img.getAmbiance() != null)
                ambianceCounts.merge(img.getAmbiance().name(), 1, Integer::sum);
            if (img.getBudgetPercu() != null)
                budgetCounts.merge(img.getBudgetPercu().name(), 1, Integer::sum);
        }

        StyleProfile avg = new StyleProfile();
        getMostFrequent(styleCounts).ifPresent(s -> avg.setStyle(com.daw9.model.enums.StyleType.valueOf(s)));
        getMostFrequent(paletteCounts).ifPresent(s -> avg.setPalette(com.daw9.model.enums.PaletteType.valueOf(s)));
        getMostFrequent(ambianceCounts).ifPresent(s -> avg.setAmbiance(com.daw9.model.enums.AmbianceType.valueOf(s)));
        getMostFrequent(budgetCounts).ifPresent(s -> avg.setBudgetPercu(com.daw9.model.enums.BudgetType.valueOf(s)));

        return avg;
    }

    private Optional<String> getMostFrequent(Map<String, Integer> counts) {
        return counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey);
    }

    private static class ItemWithScore {
        CatalogueItem item;
        int score;

        ItemWithScore(CatalogueItem item, int score) {
            this.item = item;
            this.score = score;
        }
    }
}
