-- This file pre-populates the database with some crop information.
-- It will be executed automatically by Spring Boot on startup.
-- Note: This only runs if using an in-memory database like H2.
-- For MySQL, you may need to run this manually once or configure spring.jpa.defer-datasource-initialization=true
-- For simplicity, we will assume manual insertion or that the application will add this data programmatically if needed.

-- Inserting sample crop information
-- Using INSERT IGNORE to prevent errors on re-running the app.
INSERT IGNORE INTO crop_info (id, crop_name, best_practices, potential_diseases) VALUES
(1, 'Wheat', 'Best practices for wheat: Plant in well-drained Alluvial soil. Optimal pH is 6.0-7.0. Requires consistent moisture during growing season. Fertilize with nitrogen-rich compounds.', 'Common diseases: Rusts (leaf, stem, stripe), Powdery Mildew, Fusarium Head Blight. Risk increases in humid conditions.'),
(2, 'Corn', 'Best practices for corn: Requires full sun and deep, fertile Red or Alluvial soil. Plant in blocks for good pollination. High nitrogen requirement. Water deeply, especially during tasseling.', 'Common diseases: Gray Leaf Spot, Northern Corn Leaf Blight, Goss''s Wilt. Watch for lesions on leaves.'),
(3, 'Rice', 'Best practices for rice: Best grown in flooded paddies with Clay-Loam or Alluvial soil. Maintain water level carefully. Requires high levels of nutrients, particularly nitrogen and phosphorus.', 'Common diseases: Rice Blast, Sheath Blight, Bacterial Blight. Proper water management mitigates risks.'),
(4, 'Soybean', 'Best practices for soybean: Plant in warm Black or Red soil. Inoculate seeds with Rhizobium bacteria for nitrogen fixation. Good drainage is crucial.', 'Common diseases: Soybean Rust, Sudden Death Syndrome (SDS), Frogeye Leaf Spot.'),
(5, 'Sugarcane', 'Best practices for sugarcane: Thrives in deep, rich Alluvial and Black soils with high water retention. Requires intense irrigation and nitrogen feeding. Plant in trenches.', 'Common diseases: Red Rot, Smut, Wilt. Ensure disease-free sets are used for planting.'),
(6, 'Cotton', 'Best practices for cotton: Ideal in deep Black soil (Regur). Requires a long frost-free period and high temperature. Avoid waterlogging during flowering.', 'Common diseases: Bollworm infestation, Leaf Curl Virus, Wilt. Crop rotation and timely pesticide use are critical.'),
(7, 'Pearl Millet (Bajra)', 'Best practices for bajra: Highly drought-tolerant, best suited for Sandy or Laterite soils. Avoid waterlogged areas. Requires minimal fertilization compared to other cereals.', 'Common diseases: Downy Mildew, Ergot, Smut. Use certified seeds to prevent ergot outbreaks.'),
(8, 'Groundnut', 'Best practices for groundnut: Plant in loose, friable Sandy Loam or Red soil to allow peg penetration. Ensure adequate calcium levels during pegging.', 'Common diseases: Tikka disease (Leaf Spot), Collar Rot, Rust. Maintain proper spacing to reduce moisture build-up.'),
(9, 'Chickpea (Chana)', 'Best practices for chickpea: Grown best in Black or Red soils as a rabi (winter) crop. Requires cool climate and avoids excessive rain during flowering.', 'Common diseases: Fusarium Wilt, Ascochyta Blight, Pod Borer. Treat seeds before sowing.');

-- Inserting a mock user for easy login and testing
-- Username: 'farmer_john', Password: 'password123'
-- The password has been pre-hashed using BCrypt.
INSERT IGNORE INTO users (id, username, password) VALUES
(1, 'farmer_john', '$2a$10$EAX1i09L9pFTk.dGg9R3i.d/aI3G8.wTnrFbiYssD8LpJGXb/q/iS');

-- Inserting farm details for the mock user
INSERT IGNORE INTO farm (id, user_id, acres, soil_type, location, current_crop, expected_yield) VALUES
(1, 1, 150.5, 'Clay Loam', 'Davis', 'Corn', 300);

