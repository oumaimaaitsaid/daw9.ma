TRUNCATE TABLE cat_item_styles CASCADE;
TRUNCATE TABLE cat_item_tailles CASCADE;
TRUNCATE TABLE cat_item_images CASCADE;
TRUNCATE TABLE catalogue_items CASCADE;
TRUNCATE TABLE users CASCADE;
-- ========== ADMIN USER ==========
-- Email: admin@admin.com / Mot de passe: admin
INSERT INTO users (id, email, password, nom, prenom, phone, ville, role, active)
VALUES (1, 'admin@admin.com', '$2a$12$yhZB8QWmnycPF9cXQwi9RObAK1AySs5JSwIauOcCa3Z9YvLUOXe.6', 'Admin', 'Daw9', '0600000000', 'Casablanca', 'ADMIN', true)
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - CAFTAN ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, couleur_dominante, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(1, 'Caftan Royal Doré', 'Magnifique caftan brodé fil d''or, style traditionnel fassi', 15000, 'negafa', 'caftan', NULL, 'dore', 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'PREMIUM'),
(2, 'Caftan Velours Bordeaux', 'Caftan en velours avec broderies dorées', 12000, 'negafa', 'caftan', NULL, 'bordeaux', 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'MOYEN'),
(3, 'Caftan Moderne Blanc', 'Caftan contemporain blanc cassé avec perles', 18000, 'negafa', 'caftan', NULL, 'blanc', 'MODERNE', 'SOBRE', 'ROMANTIQUE', 'PREMIUM'),
(4, 'Caftan Emeraude', 'Caftan vert émeraude avec sfifa dorée', 14000, 'negafa', 'caftan', NULL, 'vert', 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'MOYEN'),
(5, 'Caftan Rose Poudré', 'Caftan élégant rose poudré brodé main', 16000, 'negafa', 'caftan', NULL, 'rose', 'FUSION', 'SOBRE', 'ROMANTIQUE', 'PREMIUM')
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - TAKCHITA ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, couleur_dominante, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(6, 'Takchita Blanche Royale', 'Takchita 2 pièces blanche avec mdamma dorée', 20000, 'negafa', 'takchita', NULL, 'blanc', 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'LUXE'),
(7, 'Takchita Bleu Nuit', 'Takchita bleue avec broderies argentées', 17000, 'negafa', 'takchita', NULL, 'bleu', 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'PREMIUM'),
(8, 'Takchita Prune', 'Takchita couleur prune avec perles', 19000, 'negafa', 'takchita', NULL, 'prune', 'TRADITIONNEL', 'COLORE', 'ROMANTIQUE', 'PREMIUM'),
(9, 'Takchita Or et Ivoire', 'Takchita traditionnelle or et ivoire', 22000, 'negafa', 'takchita', NULL, 'dore', 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'LUXE')
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - LEBSA ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, couleur_dominante, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(10, 'Lebsa Fassiya Verte', 'Lebsa traditionnelle de Fès, verte avec ceinture dorée', 25000, 'negafa', 'lebsa', 'fassiya', 'vert', 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'LUXE'),
(11, 'Lebsa Fassiya Blanche', 'Lebsa Fassiya blanche pour la cérémonie', 28000, 'negafa', 'lebsa', 'fassiya', 'blanc', 'TRADITIONNEL', 'SOBRE', 'ELEGANT', 'LUXE'),
(12, 'Lebsa Rbatiya Bleue', 'Lebsa de Rabat couleur bleue traditionnelle', 23000, 'negafa', 'lebsa', 'rbatiya', 'bleu', 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'PREMIUM'),
(13, 'Lebsa Rbatiya Dorée', 'Lebsa Rbatiya avec broderies dorées', 26000, 'negafa', 'lebsa', 'rbatiya', 'dore', 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'LUXE'),
(14, 'Lebsa Sahraouia', 'M''lehfa traditionnelle du Sahara', 15000, 'negafa', 'lebsa', 'sahraouia', 'multicolore', 'TRADITIONNEL', 'COLORE', 'BOHEME', 'MOYEN'),
(15, 'Lebsa Soussia Colorée', 'Lebsa berbère du Souss avec motifs colorés', 18000, 'negafa', 'lebsa', 'soussia', 'multicolore', 'TRADITIONNEL', 'COLORE', 'FESTIF', 'MOYEN'),
(16, 'Lebsa Chamalia', 'Lebsa du Nord marocain', 17000, 'negafa', 'lebsa', 'chamalia', 'multicolore', 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'MOYEN')
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - ROBE MODERNE ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, couleur_dominante, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(17, 'Robe Blanche Princesse', 'Robe de mariée blanche style princesse', 12000, 'negafa', 'robe-moderne', NULL, 'blanc', 'MODERNE', 'SOBRE', 'ROMANTIQUE', 'MOYEN'),
(18, 'Robe Sirène Dentelle', 'Robe sirène en dentelle avec traîne', 15000, 'negafa', 'robe-moderne', NULL, 'blanc', 'MODERNE', 'SOBRE', 'ELEGANT', 'PREMIUM'),
(19, 'Robe Bohème Chic', 'Robe fluide style bohème avec manches', 10000, 'negafa', 'robe-moderne', NULL, 'blanc', 'MODERNE', 'SOBRE', 'BOHEME', 'MOYEN');

-- ========== NEGAFA - JABADOR ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, couleur_dominante, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(20, 'Jabador Blanc et Or', 'Jabador 3 pièces blanc avec broderies dorées', 8000, 'negafa', 'jabador', NULL, 'blanc', 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'MOYEN'),
(21, 'Jabador Beige Classique', 'Jabador beige élégant pour marié', 6500, 'negafa', 'jabador', NULL, 'beige', 'TRADITIONNEL', 'SOBRE', 'ELEGANT', 'ECONOMIQUE'),
(22, 'Jabador Bordeaux', 'Jabador bordeaux avec finitions dorées', 7500, 'negafa', 'jabador', NULL, 'bordeaux', 'TRADITIONNEL', 'COLORE', 'FESTIF', 'MOYEN'),
(23, 'Jabador Gris Perle', 'Jabador moderne gris perle', 7000, 'negafa', 'jabador', NULL, 'gris', 'MODERNE', 'SOBRE', 'ELEGANT', 'MOYEN')
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - COSTUME ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, couleur_dominante, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(24, 'Costume Noir Classique', 'Costume 3 pièces noir coupe italienne', 5000, 'negafa', 'costume', NULL, 'noir', 'MODERNE', 'SOBRE', 'ELEGANT', 'MOYEN'),
(25, 'Costume Bleu Marine', 'Costume bleu marine élégant', 5500, 'negafa', 'costume', NULL, 'bleu', 'MODERNE', 'COLORE', 'ELEGANT', 'MOYEN'),
(26, 'Costume Gris Anthracite', 'Costume gris avec gilet assorti', 6000, 'negafa', 'costume', NULL, 'gris', 'MODERNE', 'SOBRE', 'ELEGANT', 'MOYEN'),
(27, 'Costume Crème', 'Costume crème pour mariage d''été', 5500, 'negafa', 'costume', NULL, 'creme', 'MODERNE', 'SOBRE', 'ROMANTIQUE', 'MOYEN'),
(28, 'Costume Prince de Galles', 'Costume à carreaux style britannique', 6500, 'negafa', 'costume', NULL, 'gris', 'MODERNE', 'COLORE', 'ELEGANT', 'MOYEN')
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - BIJOUX ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(29, 'Parure Berbère Or', 'Parure complète bijoux berbères en or', 35000, 'negafa', 'bijoux', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'LUXE'),
(30, 'Collier Lbnat', 'Collier traditionnel avec pierres précieuses', 15000, 'negafa', 'bijoux', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'PREMIUM'),
(31, 'Diadème Mariée', 'Diadème doré avec cristaux', 8000, 'negafa', 'bijoux', NULL, 'FUSION', 'DORE_LUXE', 'ROMANTIQUE', 'MOYEN'),
(32, 'Bracelets Kholkhal', 'Paire de bracelets de cheville traditionnels', 5000, 'negafa', 'bijoux', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'FESTIF', 'MOYEN'),
(33, 'Boucles Oreilles Fassi', 'Boucles d''oreilles style fassi en or', 12000, 'negafa', 'bijoux', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'PREMIUM')
ON CONFLICT (id) DO NOTHING;

-- ========== NEGAFA - AMARIYA ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(34, 'Amariya Dorée Royale', 'Amariya traditionnelle dorée avec porteurs', 8000, 'negafa', 'amariya', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'FESTIF', 'MOYEN'),
(35, 'Amariya Blanche', 'Amariya blanche moderne avec fleurs', 6500, 'negafa', 'amariya', NULL, 'MODERNE', 'SOBRE', 'ROMANTIQUE', 'ECONOMIQUE'),
(36, 'Amariya Rouge et Or', 'Amariya couleur rouge bordeaux et or', 7500, 'negafa', 'amariya', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'MOYEN'),
(37, 'Amariya Cristal', 'Amariya avec ornements cristal', 9000, 'negafa', 'amariya', NULL, 'MODERNE', 'DORE_LUXE', 'ELEGANT', 'PREMIUM')
ON CONFLICT (id) DO NOTHING;

-- ========== ZIANA ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(38, 'Pack Ziana Complet', 'Maquillage + Coiffure + Henné pour la mariée', 5000, 'ziana', 'ziana', NULL, 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'MOYEN'),
(39, 'Pack Ziana Premium', 'Service complet avec essai maquillage', 7000, 'ziana', 'ziana', NULL, 'FUSION', 'DORE_LUXE', 'ELEGANT', 'PREMIUM'),
(40, 'Henné Traditionnel', 'Application henné mains et pieds motifs traditionnels', 2000, 'ziana', 'ziana', NULL, 'TRADITIONNEL', 'COLORE', 'BOHEME', 'ECONOMIQUE')
ON CONFLICT (id) DO NOTHING;

-- ========== TRAITEUR - ENTREES ==========
INSERT INTO catalogue_items (id, nom, description, prix, prix_par_personne, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(41, 'Briouates Assortis', 'Assortiment de briouates viande, poulet, fromage', 450, 45, 'traiteur', 'entrees', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'ECONOMIQUE'),
(42, 'Salade Marocaine', 'Assortiment de salades marocaines variées', 350, 35, 'traiteur', 'entrees', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'ECONOMIQUE'),
(43, 'Pastilla aux Fruits de Mer', 'Pastilla individuelle aux fruits de mer', 600, 60, 'traiteur', 'entrees', NULL, 'FUSION', 'DORE_LUXE', 'ELEGANT', 'MOYEN'),
(44, 'Corbeille Feuilletés', 'Mini feuilletés variés', 400, 40, 'traiteur', 'entrees', NULL, 'MODERNE', 'SOBRE', 'ELEGANT', 'ECONOMIQUE')
ON CONFLICT (id) DO NOTHING;

-- ========== TRAITEUR - PLATS PRINCIPAUX ==========
INSERT INTO catalogue_items (id, nom, description, prix, prix_par_personne, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(45, 'Méchoui Traditionnel', 'Agneau rôti entier avec accompagnements', 1500, 150, 'traiteur', 'plats-principaux', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'PREMIUM'),
(46, 'Tajine Poulet Citron', 'Tajine de poulet au citron confit et olives', 850, 85, 'traiteur', 'plats-principaux', NULL, 'TRADITIONNEL', 'COLORE', 'ELEGANT', 'MOYEN'),
(47, 'Couscous Royal', 'Couscous 7 légumes avec viandes variées', 950, 95, 'traiteur', 'plats-principaux', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'MOYEN'),
(48, 'Pastilla au Poulet', 'Pastilla traditionnelle au poulet et amandes', 700, 70, 'traiteur', 'plats-principaux', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'MOYEN')
ON CONFLICT (id) DO NOTHING;

-- ========== TRAITEUR - DESSERTS ==========
INSERT INTO catalogue_items (id, nom, description, prix, prix_par_personne, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(49, 'Plateau Pâtisseries Marocaines', 'Assortiment cornes gazelle, ghriba, fekkas', 550, 55, 'traiteur', 'desserts', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'MOYEN'),
(50, 'Corbeille Fruits Frais', 'Sélection de fruits de saison', 400, 40, 'traiteur', 'desserts', NULL, 'MODERNE', 'COLORE', 'BOHEME', 'ECONOMIQUE'),
(51, 'Chebbakia au Miel', 'Chebbakia traditionnelle au miel et sésame', 300, 30, 'traiteur', 'desserts', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'FESTIF', 'ECONOMIQUE'),
(52, 'Assortiment Baklawa', 'Baklawa aux amandes et miel', 500, 50, 'traiteur', 'desserts', NULL, 'FUSION', 'DORE_LUXE', 'ELEGANT', 'MOYEN')
ON CONFLICT (id) DO NOTHING;

-- ========== TRAITEUR - GATEAU MARIAGE ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(53, 'Gâteau 3 Étages Classique', 'Gâteau de mariage 3 étages vanille-chocolat', 3500, 'traiteur', 'gateau-mariage', NULL, 'MODERNE', 'SOBRE', 'ROMANTIQUE', 'PREMIUM'),
(54, 'Pièce Montée Choux', 'Pièce montée traditionnelle aux choux', 2800, 'traiteur', 'gateau-mariage', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'MOYEN'),
(55, 'Wedding Cake Fleuri', 'Gâteau décoré de fleurs fraîches', 4500, 'traiteur', 'gateau-mariage', NULL, 'MODERNE', 'COLORE', 'ROMANTIQUE', 'LUXE'),
(56, 'Gâteau Nude Cake', 'Gâteau style nude cake avec fruits', 3000, 'traiteur', 'gateau-mariage', NULL, 'MODERNE', 'SOBRE', 'BOHEME', 'PREMIUM')
ON CONFLICT (id) DO NOTHING;

-- ========== TRAITEUR - BOISSONS ==========
INSERT INTO catalogue_items (id, nom, description, prix, prix_par_personne, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(57, 'Jus Frais Assortis', 'Orange, pomme, fruits rouges', 150, 15, 'traiteur', 'boissons', NULL, 'MODERNE', 'COLORE', 'FESTIF', 'ECONOMIQUE'),
(58, 'Thé à la Menthe', 'Service thé marocain traditionnel', 100, 10, 'traiteur', 'boissons', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'ECONOMIQUE')
ON CONFLICT (id) DO NOTHING;

-- ========== PHOTOGRAPHE ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(59, 'Pack Photo Essentiel', 'Couverture photo de la cérémonie', 8000, 'photographe', 'photographe', NULL, 'MODERNE', 'SOBRE', 'ROMANTIQUE', 'MOYEN'),
(60, 'Pack Photo + Vidéo', 'Couverture complète photo et vidéo HD', 15000, 'photographe', 'photographe', NULL, 'MODERNE', 'COLORE', 'ELEGANT', 'PREMIUM'),
(61, 'Pack Premium Drone', 'Photo, vidéo, drone et album luxe', 25000, 'photographe', 'photographe', NULL, 'MODERNE', 'DORE_LUXE', 'ELEGANT', 'LUXE')
ON CONFLICT (id) DO NOTHING;

-- ========== DJ ==========
INSERT INTO catalogue_items (id, nom, description, prix, categorie, sous_categorie, type, style_profile_style, style_profile_palette, style_profile_ambiance, style_profile_budget)
VALUES
(62, 'DJ Ambiance Marocaine', 'DJ spécialisé musique marocaine et orientale', 5000, 'dj', 'dj', NULL, 'TRADITIONNEL', 'COLORE', 'FESTIF', 'MOYEN'),
(63, 'DJ Mix International', 'DJ polyvalent tous styles musicaux', 6000, 'dj', 'dj', NULL, 'MODERNE', 'COLORE', 'FESTIF', 'MOYEN'),
(64, 'Orchestre Traditionnel', 'Groupe musique andalouse et chaabi', 12000, 'dj', 'dj', NULL, 'TRADITIONNEL', 'DORE_LUXE', 'ELEGANT', 'PREMIUM'),
(65, 'Pack DJ + Sono Complet', 'DJ avec système son et lumières pro', 8000, 'dj', 'dj', NULL, 'MODERNE', 'COLORE', 'FESTIF', 'MOYEN')
ON CONFLICT (id) DO NOTHING;

-- ========== IMAGES ==========
DELETE FROM cat_item_images;
-- CAFTAN
INSERT INTO cat_item_images (cat_item_id, images) VALUES (1, '/uploads/catalogue/caftan_01.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (2, '/uploads/catalogue/caftan_02.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (3, '/uploads/catalogue/caftan_03.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (4, '/uploads/catalogue/caftan_04.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (5, '/uploads/catalogue/caftan_05.png');

-- TAKCHITA
INSERT INTO cat_item_images (cat_item_id, images) VALUES (6, '/uploads/catalogue/takchita_01.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (7, '/uploads/catalogue/takchita_02.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (8, '/uploads/catalogue/takchita_03.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (9, '/uploads/catalogue/takchita_04.png');

-- LEBSA
INSERT INTO cat_item_images (cat_item_id, images) VALUES (10, '/uploads/catalogue/lebsa_fassiya_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (11, '/uploads/catalogue/lebsa_fassiya_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (12, '/uploads/catalogue/lebsa_rbatiya_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (13, '/uploads/catalogue/lebsa_rbatiya_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (14, '/uploads/catalogue/lebsa_sahraouia_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (15, '/uploads/catalogue/lebsa_soussia_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (16, '/uploads/catalogue/lebsa_chamalia_01.jpg');

-- ROBE MODERNE
INSERT INTO cat_item_images (cat_item_id, images) VALUES (17, '/uploads/catalogue/robe_moderne_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (18, '/uploads/catalogue/robe_moderne_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (19, '/uploads/catalogue/robe_moderne_03.jpg');

-- JABADOR
INSERT INTO cat_item_images (cat_item_id, images) VALUES (20, '/uploads/catalogue/jabador_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (21, '/uploads/catalogue/jabador_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (22, '/uploads/catalogue/jabador_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (23, '/uploads/catalogue/jabador_04.png');

-- COSTUME
INSERT INTO cat_item_images (cat_item_id, images) VALUES (24, '/uploads/catalogue/costume_01.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (25, '/uploads/catalogue/costume_02.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (26, '/uploads/catalogue/costume_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (27, '/uploads/catalogue/costume_04.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (28, '/uploads/catalogue/costume_05.jpg');

-- BIJOUX
INSERT INTO cat_item_images (cat_item_id, images) VALUES (29, '/uploads/catalogue/bijoux_01.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (30, '/uploads/catalogue/bijoux_02.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (31, '/uploads/catalogue/bijoux_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (32, '/uploads/catalogue/bijoux_04.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (33, '/uploads/catalogue/bijoux_05.jpg');

-- AMARIYA
INSERT INTO cat_item_images (cat_item_id, images) VALUES (34, '/uploads/catalogue/amariya_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (35, '/uploads/catalogue/amariya_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (36, '/uploads/catalogue/amariya_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (37, '/uploads/catalogue/amariya_04.jpg');

-- ZIANA
INSERT INTO cat_item_images (cat_item_id, images) VALUES (38, '/uploads/catalogue/ziana_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (39, '/uploads/catalogue/ziana_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (40, '/uploads/catalogue/ziana_03.jpg');

-- TRAITEUR ENTREES
INSERT INTO cat_item_images (cat_item_id, images) VALUES (41, '/uploads/catalogue/entrees_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (42, '/uploads/catalogue/entrees_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (43, '/uploads/catalogue/entrees_03.png');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (44, '/uploads/catalogue/entrees_04.jpg');

-- TRAITEUR PLATS
INSERT INTO cat_item_images (cat_item_id, images) VALUES (45, '/uploads/catalogue/plats_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (46, '/uploads/catalogue/plats_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (47, '/uploads/catalogue/plats_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (48, '/uploads/catalogue/plats_04.jpg');

-- TRAITEUR DESSERTS
INSERT INTO cat_item_images (cat_item_id, images) VALUES (49, '/uploads/catalogue/desserts_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (50, '/uploads/catalogue/desserts_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (51, '/uploads/catalogue/desserts_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (52, '/uploads/catalogue/desserts_04.jpg');

-- TRAITEUR GATEAU
INSERT INTO cat_item_images (cat_item_id, images) VALUES (53, '/uploads/catalogue/gateau_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (54, '/uploads/catalogue/gateau_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (55, '/uploads/catalogue/gateau_03.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (56, '/uploads/catalogue/gateau_04.jpg');

-- TRAITEUR BOISSONS
INSERT INTO cat_item_images (cat_item_id, images) VALUES (57, '/uploads/catalogue/boissons_01.avif');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (58, '/uploads/catalogue/boissons_02.avif');

-- PHOTOGRAPHE
INSERT INTO cat_item_images (cat_item_id, images) VALUES (59, '/uploads/catalogue/photographe_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (60, '/uploads/catalogue/photographe_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (61, '/uploads/catalogue/photographe_03.jpg');

-- DJ
INSERT INTO cat_item_images (cat_item_id, images) VALUES (62, '/uploads/catalogue/dj_01.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (63, '/uploads/catalogue/dj_02.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (64, '/uploads/catalogue/dj_05.jpg');
INSERT INTO cat_item_images (cat_item_id, images) VALUES (65, '/uploads/catalogue/dj_04.jpg');

-- ========== TAILLES (pour les tenues) ==========
DELETE FROM cat_item_tailles;
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (1, 'S'), (1, 'M'), (1, 'L');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (2, 'S'), (2, 'M'), (2, 'L');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (3, 'S'), (3, 'M'), (3, 'L');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (4, 'M'), (4, 'L'), (4, 'XL');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (5, 'S'), (5, 'M'), (5, 'L');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (6, 'M'), (6, 'L');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (7, 'S'), (7, 'M'), (7, 'L');
INSERT INTO cat_item_tailles (cat_item_id, tailles) VALUES (8, 'M'), (8, 'L');

-- ========== STYLES (pour photographe et DJ) ==========
DELETE FROM cat_item_styles;
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (59, 'Reportage'), (59, 'Portrait');
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (60, 'Reportage'), (60, 'Cinématique');
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (61, 'Reportage'), (61, 'Cinématique'), (61, 'Drone');
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (62, 'Chaabi'), (62, 'Rai'), (62, 'Oriental');
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (63, 'Pop'), (63, 'Dance'), (63, 'Oriental');
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (64, 'Andalou'), (64, 'Chaabi'), (64, 'Malhoun');
INSERT INTO cat_item_styles (cat_item_id, styles) VALUES (65, 'Mix'), (65, 'International');

-- Reset sequences to continue after our manual IDs
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('catalogue_items_id_seq', (SELECT MAX(id) FROM catalogue_items));
