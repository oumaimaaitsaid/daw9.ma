package com.daw9.mapper;

import com.daw9.dto.CatalogueItemDTO;
import com.daw9.model.CatalogueItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CatalogueMapper {
    CatalogueItemDTO toDTO(CatalogueItem item);
}
