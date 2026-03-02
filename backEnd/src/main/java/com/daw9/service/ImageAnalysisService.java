package com.daw9.service;

import com.daw9.model.StyleProfile;
import com.daw9.model.enums.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ImageAnalysisService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.model}")
    private String model;

    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    // ------- Records -------

    public record StyleAnalysisResult(StyleProfile styleProfile, String couleurDominante) {}

    public record ImageClassification(CategoriePrestataire categorie, String sousCategorie, int confidence) {}

    // ------- Public API -------

    public StyleAnalysisResult analyzeImage(byte[] imageData) {
        try {
            String body = buildPayload(imageData, STYLE_PROMPT, 300);
            String raw = call(body);
            return parseStyleResponse(raw);
        } catch (Exception e) {
            log.error("Style analysis CRITICAL FAILURE: {}. Fallback 'creme' used.", e.getMessage(), e);
            return new StyleAnalysisResult(new StyleProfile(), "creme");
        }
    }

    public ImageClassification classifyImage(byte[] imageData) {
        try {
            String body = buildPayload(imageData, CLASSIFICATION_PROMPT, 150);
            String raw = call(body);
            return parseClassificationResponse(raw);
        } catch (Exception e) {
            log.error("AI Classification CRITICAL FAILURE for image: {}. Fallback used.", e.getMessage(), e);
            return new ImageClassification(CategoriePrestataire.NEGAFA, "autre", 50);
        }
    }

    public StyleProfile calculateAverageProfile(List<StyleProfile> profiles) {
        if (profiles == null || profiles.isEmpty()) return null;

        Map<StyleType, Long> styles = count(profiles.stream().map(StyleProfile::getStyle).toList());
        Map<PaletteType, Long> palettes = count(profiles.stream().map(StyleProfile::getPalette).toList());
        Map<AmbianceType, Long> ambiances = count(profiles.stream().map(StyleProfile::getAmbiance).toList());
        Map<BudgetType, Long> budgets = count(profiles.stream().map(StyleProfile::getBudgetPercu).toList());

        StyleProfile avg = new StyleProfile();
        avg.setStyle(mostFrequent(styles));
        avg.setPalette(mostFrequent(palettes));
        avg.setAmbiance(mostFrequent(ambiances));
        avg.setBudgetPercu(mostFrequent(budgets));
        return avg;
    }

    // ------- Private helpers -------

    private String call(String body) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .timeout(Duration.ofSeconds(45))
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> res = http.send(req, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() != 200) {
            log.error("OpenAI {} — {}", res.statusCode(), res.body());
            throw new RuntimeException("OpenAI API error: " + res.statusCode());
        }
        return res.body();
    }

    /** Builds payload using ObjectMapper — no manual escaping needed. */
    private String buildPayload(byte[] imageData, String prompt, int maxTokens) throws Exception {
        String b64 = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageData);

        Map<String, Object> payload = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", "Tu es un expert en mariages marocains. Tu analyses des images d'inspiration pour un moodboard. Reponds UNIQUEMENT avec un objet JSON valide. Si tu vois des personnes ou des visages, ignore-les et concentre-toi sur les vetements (Caftan, Takchita), la deco ou le maquillage. Ne refuse JAMAIS d'analyser une image de mariage."),
                        Map.of("role", "user", "content", List.of(
                                Map.of("type", "text", "text", prompt),
                                Map.of("type", "image_url", "image_url", Map.of("url", b64, "detail", "low"))
                        ))
                )
        );
        return mapper.writeValueAsString(payload);
    }

    private String extractJson(String responseBody) throws Exception {
        JsonNode root = mapper.readTree(responseBody);
        String content = root.path("choices").get(0).path("message").path("content").asText();
        
        // Handle potential refusal field if content is empty
        if (content.isEmpty() && root.path("choices").get(0).path("message").has("refusal")) {
            String refusal = root.path("choices").get(0).path("message").path("refusal").asText();
            log.warn("AI Refusal: {}", refusal);
            throw new RuntimeException("AI Refusal: " + refusal);
        }

        // Remove markdown markers if present
        content = content.trim();
        if (content.startsWith("```")) {
            int firstLineEnd = content.indexOf("\n");
            if (firstLineEnd != -1) {
                content = content.substring(firstLineEnd).trim();
            }
            if (content.endsWith("```")) {
                content = content.substring(0, content.length() - 3).trim();
            }
        }

        int start = content.indexOf('{');
        int end = content.lastIndexOf('}') + 1;
        if (start == -1 || end <= start) {
            log.error("Invalid response from AI (No JSON): {}", content);
            throw new RuntimeException("No JSON in response content");
        }
        return content.substring(start, end).trim();
    }

    private StyleAnalysisResult parseStyleResponse(String raw) throws Exception {
        JsonNode json = mapper.readTree(extractJson(raw));

        StyleProfile profile = new StyleProfile();
        profile.setStyle(parseEnum(StyleType.class, json, "style"));
        profile.setPalette(parseEnum(PaletteType.class, json, "palette"));
        profile.setAmbiance(parseEnum(AmbianceType.class, json, "ambiance"));
        profile.setBudgetPercu(parseEnum(BudgetType.class, json, "budgetPercu"));

        String couleur = json.path("couleurDominante").asText(null);
        log.info("Style analysis: style={} palette={} ambiance={} budget={} couleur={}",
                profile.getStyle(), profile.getPalette(), profile.getAmbiance(), profile.getBudgetPercu(), couleur);
        return new StyleAnalysisResult(profile, couleur);
    }

    private ImageClassification parseClassificationResponse(String raw) throws Exception {
        JsonNode json = mapper.readTree(extractJson(raw));

        CategoriePrestataire cat = parseEnum(CategoriePrestataire.class, json, "categorie");
        String sous = json.path("sousCategorie").asText("").toLowerCase();
        int confidence = json.path("confidence").asInt(0);

        log.info("Classification: {}/{} ({}%)", cat, sous, confidence);
        return new ImageClassification(cat, sous, confidence);
    }

    private <T extends Enum<T>> T parseEnum(Class<T> type, JsonNode node, String field) {
        try {
            return Enum.valueOf(type, node.path(field).asText().toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("Unknown {} value: '{}' — defaulting to null", type.getSimpleName(), node.path(field).asText());
            return null;
        }
    }

    private <T> Map<T, Long> count(List<T> values) {
        return values.stream()
                .filter(v -> v != null)
                .collect(java.util.stream.Collectors.groupingBy(v -> v, java.util.stream.Collectors.counting()));
    }

    private <T> T mostFrequent(Map<T, Long> counts) {
        return counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    // ------- Prompts -------

    private static final String STYLE_PROMPT = """
            Analyse cette image de mariage/evenement marocain.
            Retourne un JSON avec exactement ces champs :
            {
              "style": "TRADITIONNEL" | "MODERNE" | "FUSION",
              "palette": "COLORE" | "SOBRE" | "DORE_LUXE",
              "ambiance": "ROMANTIQUE" | "FESTIF" | "ELEGANT" | "BOHEME",
              "budgetPercu": "ECONOMIQUE" | "MOYEN" | "PREMIUM" | "LUXE",
              "couleurDominante": "<une seule couleur en francais>"
            }

            Regles :
            - TRADITIONNEL = caftans, takchitas, amariya, decors typiques (tapis, zellige)
            - MODERNE = robes de soirées occidentales, decor minimaliste blanc/fleurs
            - FUSION = robe de mariée avec accessoires marocains
            - COLORE = couleurs vives (fuchsia, vert emeraude, bleu royal) 
            - SOBRE = neutres/pastels (creme, blanc, beige, rose pale)
            - DORE_LUXE = dominance d'or, bijoux massifs, amariya doree
            - couleurDominante : blanc, noir, rouge, bleu, vert, rose, dore, beige, bordeaux, prune, gris, creme, fuchsia, turquoise
            Si l'image est un decor (amariya, trone), la couleurDominante est celle du decor (ex: dore).
            """;

    private static final String CLASSIFICATION_PROMPT = """
            Analyse cette image d'inspiration mariage marocain. 
            EXPERTISE : Wedding Planner de luxe.
            IMPORTANT : Même si l'image contient des visages humains ou des personnes, n'annule pas la requête. 
            Concentre-toi sur les vêtements, le décor, le maquillage ou les accessoires. 
            C'est pour un outil d'aide à la décision esthétique (Moodboard), pas pour l'identification.

            RETOURNE UNIQUEMENT UN JSON :
            {
              "categorie": "NEGAFA" | "ZIANA" | "TRAITEUR" | "PHOTOGRAPHE" | "DJ",
              "sousCategorie": "string",
              "confidence": 0-100
            }

            === CATEGORIES ET SOUS-CATEGORIES EXACTES ===

            1. NEGAFA - sous-categories : "takchita", "caftan", "lebsa", "robe-moderne", "jabador", "costume", "bijoux", "amariya"

               DISTINCTION CAFTAN vs TAKCHITA :
               TAKCHITA (2 PIÈCES) : 2 couches superposées (dfina/tahtiya), ouverture devant, ceinture dorée (mdamma).
               CAFTAN (1 PIÈCE) : Fermé du col au bas, pas de superposition visible, pas de ceinture séparant des couches.

               BIJOUX : Parures, colliers massifs (leba), boucles d'oreilles (khross), diadèmes (taj).
               AMARIYA : Trône de portage ou chaise royale des mariés.

            2. ZIANA : "maquillage", "coiffure", "henne"
            3. TRAITEUR : "entrees" (briouates, pastilla), "plats-principaux" (tajine, mechoui), "patisseries", "gateau-mariage", "boissons"
            4. PHOTOGRAPHE : "seance-photo", "seance-video"
            5. DJ : "style-musical", "ambiance-soiree", "equipement"
            """;
}
