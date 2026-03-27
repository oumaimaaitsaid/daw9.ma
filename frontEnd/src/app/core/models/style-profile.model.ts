export enum StyleType {
  TRADITIONNEL = 'TRADITIONNEL',
  MODERNE = 'MODERNE',
  FUSION = 'FUSION'
}

export enum PaletteType {
  COLORE = 'COLORE',
  SOBRE = 'SOBRE',
  DORE_LUXE = 'DORE_LUXE'
}

export enum AmbianceType {
  ROMANTIQUE = 'ROMANTIQUE',
  FESTIF = 'FESTIF',
  ELEGANT = 'ELEGANT',
  BOHEME = 'BOHEME'
}

export enum BudgetType {
  ECONOMIQUE = 'ECONOMIQUE',
  MOYEN = 'MOYEN',
  PREMIUM = 'PREMIUM',
  LUXE = 'LUXE'
}

export interface StyleProfile {
  style?: StyleType;
  palette?: PaletteType;
  ambiance?: AmbianceType;
  budgetPercu?: BudgetType;
}
