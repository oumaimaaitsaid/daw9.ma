package com.daw9.mapper;

import com.daw9.dto.AuthResponse;
import com.daw9.dto.RegisterClientRequest;
import com.daw9.model.Client;
import com.daw9.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", source = "id")
    @Mapping(target = "role", expression = "java(user.getRole().name())")
    @Mapping(target = "token", ignore = true)
    AuthResponse toAuthResponse(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "CLIENT")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "password", ignore = true)
    Client toEntity(RegisterClientRequest req);
}
