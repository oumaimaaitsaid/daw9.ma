export const TYPE_OPTIONS: { [key: string]: { value: string, label: string }[] } = {
  'lebsa': [
    { value: 'fassiya', label: 'Lebsa Fassiya (Fès)' },
    { value: 'rbatiya', label: 'Lebsa Rbatiya (Rabat)' },
    { value: 'sahraouia', label: 'Lebsa Sahraouia (Sahara)' },
    { value: 'soussia', label: 'Lebsa Soussia (Souss - Berbère)' },
    { value: 'chamalia', label: 'Lebsa Chamalia (Nord)' }
  ]
};

export const FIELDS_CONFIG: { [key: string]: { fields: string[], labels: { [key: string]: string } } } = {
  'caftan': { fields: ['couleurs', 'tailles', 'matieres'], labels: { couleurs: 'Couleurs disponibles', tailles: 'Tailles', matieres: 'Matières' } },
  'takchita': { fields: ['couleurs', 'tailles', 'matieres'], labels: { couleurs: 'Couleurs disponibles', tailles: 'Tailles', matieres: 'Matières' } },
  'lebsa': { fields: ['type', 'couleurs', 'tailles', 'matieres'], labels: { type: 'Type de Lebsa', couleurs: 'Couleurs disponibles', tailles: 'Tailles', matieres: 'Matières' } },
  'robe-moderne': { fields: ['couleurs', 'tailles', 'styles'], labels: { couleurs: 'Couleurs disponibles', tailles: 'Tailles', styles: 'Styles' } },
  'jabador': { fields: ['couleurs', 'tailles', 'matieres'], labels: { couleurs: 'Couleurs disponibles', tailles: 'Tailles', matieres: 'Matières' } },
  'costume': { fields: ['couleurs', 'tailles', 'styles'], labels: { couleurs: 'Couleurs disponibles', tailles: 'Tailles', styles: 'Styles' } },
  'bijoux': { fields: ['matieres', 'styles'], labels: { matieres: 'Matières (or, argent...)', styles: 'Styles' } },
  'amariya': { fields: ['styles', 'couleurs'], labels: { styles: 'Styles', couleurs: 'Couleurs disponibles' } },
  'maquillage': { fields: ['styles', 'duree'], labels: { styles: 'Styles (naturel, glamour, libanais...)', duree: 'Durée (minutes)' } },
  'coiffure': { fields: ['styles', 'duree'], labels: { styles: 'Styles (chignon, lâché, tresse...)', duree: 'Durée (minutes)' } },
  'henne': { fields: ['styles', 'duree', 'zone'], labels: { styles: 'Styles (traditionnel, moderne, indien...)', duree: 'Durée (minutes)', zone: 'Zone de déplacement' } },
  'entrees': { fields: ['prixParPersonne', 'capaciteMin', 'capaciteMax'], labels: { prixParPersonne: 'Prix par personne (DH)', capaciteMin: 'Capacité min', capaciteMax: 'Capacité max' } },
  'plats-principaux': { fields: ['prixParPersonne', 'capaciteMin', 'capaciteMax'], labels: { prixParPersonne: 'Prix par personne (DH)', capaciteMin: 'Capacité min', capaciteMax: 'Capacité max' } },
  'desserts': { fields: ['prixParPersonne'], labels: { prixParPersonne: 'Prix par personne (DH)' } },
  'gateau-mariage': { fields: ['styles'], labels: { styles: 'Styles (étages, thème...)' } },
  'boissons': { fields: ['prixParPersonne'], labels: { prixParPersonne: 'Prix par personne (DH)' } },
  'seance-photo': { fields: ['styles', 'duree', 'zone'], labels: { styles: 'Styles (reportage, artistique, classique...)', duree: 'Durée (heures)', zone: 'Zone de déplacement' } },
  'seance-video': { fields: ['styles', 'duree', 'zone'], labels: { styles: 'Styles (cinématique, clip, documentaire...)', duree: 'Durée (heures)', zone: 'Zone de déplacement' } },
  'style-musical': { fields: ['styles'], labels: { styles: 'Genres (chaabi, rai, house, oriental...)' } },
  'ambiance-soiree': { fields: ['styles', 'duree'], labels: { styles: 'Types (animée, lounge, traditionnelle...)', duree: 'Durée (heures)' } },
  'equipement': { fields: ['styles'], labels: { styles: 'Équipements (sono, lumières, écran...)' } },
  'ziana': { fields: ['styles', 'duree'], labels: { styles: 'Typologie de Styles', duree: 'Temporalité (Min)' } },
  'photographe': { fields: ['styles', 'duree', 'zone'], labels: { styles: 'Styles', duree: 'Duree (heures)', zone: 'Zone' } },
  'dj': { fields: ['styles', 'duree', 'zone'], labels: { styles: 'Styles', duree: 'Duree (heures)', zone: 'Zone' } }
};

export const CATEGORY_MAP: { [key: string]: string } = {
  'caftan': 'negafa', 'takchita': 'negafa', 'lebsa': 'negafa', 'robe-moderne': 'negafa', 'jabador': 'negafa', 'costume': 'negafa', 'bijoux': 'negafa', 'amariya': 'negafa', 'maquillage': 'ziana', 'coiffure': 'ziana', 'henne': 'ziana', 'entrees': 'traiteur', 'plats-principaux': 'traiteur', 'desserts': 'traiteur', 'gateau-mariage': 'traiteur', 'boissons': 'traiteur', 'seance-photo': 'photographe', 'seance-video': 'photographe', 'style-musical': 'dj', 'ambiance-soiree': 'dj', 'equipement': 'dj',
  'ziana': 'ziana', 'photographe': 'photographe', 'dj': 'dj'
};

export const LABELS: { [key: string]: string } = {
  'caftan': 'Caftan', 'takchita': 'Takchita', 'lebsa': 'Lebsa', 'robe-moderne': 'Robe moderne', 'jabador': 'Jabador', 'costume': 'Costume', 'bijoux': 'Bijoux', 'amariya': 'Amariya', 'maquillage': 'Maquillage', 'coiffure': 'Coiffure', 'henne': 'Henné', 'entrees': 'Entrées', 'plats-principaux': 'Plats principaux', 'desserts': 'Desserts', 'gateau-mariage': 'Gâteau de mariage', 'boissons': 'Boissons', 'seance-photo': 'Séance photo', 'seance-video': 'Séance vidéo', 'style-musical': 'Style musical', 'ambiance-soiree': 'Ambiance soirée', 'equipement': 'Équipement',
  'ziana': 'Services Beauté & Ziana', 'photographe': 'Artistes Visuels & Photographie', 'dj': 'Ambiance Musicale & DJ'
};

export const STYLE_OPTIONS = [
  { value: 'TRADITIONNEL', label: 'Traditionnel' },
  { value: 'MODERNE', label: 'Moderne' },
  { value: 'FUSION', label: 'Fusion' }
];

export const PALETTE_OPTIONS = [
  { value: 'COLORE', label: 'Coloré' },
  { value: 'SOBRE', label: 'Sobre' },
  { value: 'DORE_LUXE', label: 'Doré & Luxe' }
];

export const AMBIANCE_OPTIONS = [
  { value: 'ROMANTIQUE', label: 'Romantique' },
  { value: 'FESTIF', label: 'Festif' },
  { value: 'ELEGANT', label: 'Élégant' },
  { value: 'BOHEME', label: 'Bohème' }
];

export const BUDGET_OPTIONS = [
  { value: 'ECONOMIQUE', label: 'Économique' },
  { value: 'MOYEN', label: 'Moyen' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'LUXE', label: 'Luxe' }
];

export const COULEUR_OPTIONS = [
  'Blanc', 'Crème', 'Ivoire', 'Argent', 'Or', 'Rose poudré', 'Rouge', 'Vert émeraude', 'Bleu royal', 'Noir'
];

export const TENUES_SOUS_CATEGORIES = ['caftan', 'takchita', 'lebsa', 'robe-moderne', 'jabador', 'costume'];
