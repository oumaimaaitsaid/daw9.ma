package com.daw9.mapper;

import com.daw9.dto.ReservationResponseDTO;
import com.daw9.dto.UserSummaryDTO;
import com.daw9.dto.CatalogueItemDTO;
import com.daw9.model.Client;
import com.daw9.model.DemandeReservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import static org.mapstruct.factory.Mappers.getMapper;

@Mapper(componentModel = "spring", uses = { CatalogueMapper.class })
public interface ReservationMapper {

    @Mapping(target = "status", expression = "java(reservation.getStatus().name())")
    @Mapping(target = "client", source = "client")
    @Mapping(target = "items", source = "items")
    @Mapping(target = "negafa", expression = "java(filterItem(reservation, \"negafa\"))")
    @Mapping(target = "traiteur", expression = "java(filterItem(reservation, \"traiteur\"))")
    @Mapping(target = "photographe", expression = "java(filterItem(reservation, \"photographe\"))")
    ReservationResponseDTO toDTO(DemandeReservation reservation);

    UserSummaryDTO toUserSummary(Client client);

    default CatalogueItemDTO filterItem(DemandeReservation reservation, String category) {
        if (reservation.getItems() == null)
            return null;
        return reservation.getItems().stream()
                .filter(item -> category.equalsIgnoreCase(item.getCategorie()))
                .findFirst()
                .map(item -> getMapper(CatalogueMapper.class).toDTO(item))
                .orElse(null);
    }
}
