package com.daw9.service;

import com.daw9.dto.CatalogueItemDTO;
import com.daw9.mapper.CatalogueMapper;
import com.daw9.model.*;
import com.daw9.model.enums.*;
import com.daw9.repository.CatalogueItemRepository;
import com.daw9.repository.MoodboardImageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CatalogueMatchingServiceImplTest {

    @Mock
    private CatalogueItemRepository catalogueItemRepository;
    @Mock
    private MoodboardImageRepository moodboardRepo;
    @Mock
    private CatalogueMapper catalogueMapper;

    @InjectMocks
    private CatalogueMatchingServiceImpl matchingService;

    private Long clientId = 1L;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testGetSuggestionsNoImages() {
        when(moodboardRepo.findByClientId(clientId)).thenReturn(Collections.emptyList());

        Map<String, List<CatalogueItemDTO>> result = matchingService.getSuggestions(clientId);

        assertTrue(result.isEmpty());
    }

    @Test
    void testGetSuggestionsWithTenueMatching() {
        // Prepare moodboard images
        MoodboardImage img = new MoodboardImage();
        img.setSousCategorie("caftan");
        img.setCouleurDominante("Rouge");

        StyleProfile sp = new StyleProfile();
        sp.setStyle(StyleType.TRADITIONNEL);
        sp.setPalette(PaletteType.COLORE);
        sp.setAmbiance(AmbianceType.ELEGANT);
        sp.setBudgetPercu(BudgetType.PREMIUM);
        img.setStyleProfile(sp);

        when(moodboardRepo.findByClientId(clientId)).thenReturn(List.of(img));

        // Prepare catalogue items
        CatalogueItem item1 = new CatalogueItem();
        item1.setNom("Caftan Royal");
        item1.setSousCategorie("caftan");
        item1.setCouleurDominante("Rouge");
        StyleProfile itemSp1 = new StyleProfile();
        itemSp1.setStyle(StyleType.TRADITIONNEL);
        item1.setStyleProfile(itemSp1);

        CatalogueItem item2 = new CatalogueItem();
        item2.setNom("Takchita Bleue");
        item2.setSousCategorie("caftan");
        item2.setCouleurDominante("Bleu");

        when(catalogueItemRepository.findBySousCategorie(eq("caftan"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(item1, item2)));
        
        when(catalogueMapper.toDTO(any(CatalogueItem.class))).thenAnswer(invocation -> {
            CatalogueItem item = invocation.getArgument(0);
            return new CatalogueItemDTO(item.getId(), item.getNom(), null, null, null, null, null, null, null, null, null);
        });

        Map<String, List<CatalogueItemDTO>> result = matchingService.getSuggestions(clientId);

        assertFalse(result.isEmpty());
        assertTrue(result.containsKey("caftan"));
        List<CatalogueItemDTO> suggestions = result.get("caftan");
        assertEquals("Caftan Royal", suggestions.get(0).nom());
    }
}
