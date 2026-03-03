package com.daw9.service;

import java.util.Map;

public interface CatalogueMatchingService {
    Map<String, Object> getSuggestions(Long clientId);
}
