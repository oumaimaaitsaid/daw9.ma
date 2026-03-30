package com.daw9.mapper;

import com.daw9.dto.MoodboardImageDTO;
import com.daw9.model.MoodboardImage;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface MoodboardMapper {

    MoodboardImageDTO toDTO(MoodboardImage image);

    List<MoodboardImageDTO> toDTOList(List<MoodboardImage> images);
}
