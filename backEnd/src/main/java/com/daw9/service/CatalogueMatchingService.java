package com.daw9.service;

import com.daw9.dto.CatalogueItemDTO;
import java.util.List;
import java.util.Map;

public interface CatalogueMatchingService {
    Map<String, List<CatalogueItemDTO>> getSuggestions(Long clientId);
}
