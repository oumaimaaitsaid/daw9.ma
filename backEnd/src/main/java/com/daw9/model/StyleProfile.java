package com.daw9.model;

import com.daw9.model.enums.*;
import java.io.Serializable;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StyleProfile implements Serializable {
    private static final long serialVersionUID = 1L;

    @Enumerated(EnumType.STRING)
    private StyleType style;

    @Enumerated(EnumType.STRING)
    private PaletteType palette;

    @Enumerated(EnumType.STRING)
    private AmbianceType ambiance;

    @Enumerated(EnumType.STRING)
    private BudgetType budgetPercu;
}
