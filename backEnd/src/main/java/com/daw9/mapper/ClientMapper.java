package com.daw9.mapper;

import com.daw9.dto.ClientProfileDTO;
import com.daw9.model.Client;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    @Mapping(target = "nombreInvites", expression = "java(getNombreInvites(client))")
    ClientProfileDTO toProfileDTO(Client client);

    default Integer getNombreInvites(Client client) {
        if (client.getReservations() == null || client.getReservations().isEmpty()) {
            return null;
        }
        return client.getReservations().iterator().next().getNombreInvites();
    }
}
