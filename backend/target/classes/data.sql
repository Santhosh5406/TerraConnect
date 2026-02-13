-- This file pre-populates the database with some crop information.
-- It will be executed automatically by Spring Boot on startup.
-- Note: This only runs if using an in-memory database like H2.
-- For MySQL, you may need to run this manually once or configure spring.jpa.defer-datasource-initialization=true
-- For simplicity, we will assume manual insertion or that the application will add this data programmatically if needed.

-- Inserting sample crop information
-- Using INSERT IGNORE to prevent errors on re-running the app.
INSERT IGNORE INTO crop_info (id, crop_name, best_practices, potential_diseases) VALUES
(1, 'Wheat', 'Best practices for wheat: Plant in well-drained loamy soil. Optimal pH is 6.0-7.0. Requires consistent moisture during growing season. Fertilize with nitrogen-rich compounds.', 'Common diseases: Rusts (leaf, stem, stripe), Powdery Mildew, Fusarium Head Blight. Risk increases in humid conditions and monoculture fields.'),
(2, 'Corn', 'Best practices for corn: Requires full sun and deep, fertile soil. Plant in blocks for good pollination. High nitrogen requirement. Water deeply, especially during tasseling.', 'Common diseases: Gray Leaf Spot, Northern Corn Leaf Blight, Goss''s Wilt. Watch for lesions on leaves, especially after wet and windy weather.'),
(3, 'Rice', 'Best practices for rice: Best grown in flooded paddies with clay-loam soil. Maintain water level carefully. Requires high levels of nutrients, particularly nitrogen and phosphorus.', 'Common diseases: Rice Blast, Sheath Blight, Bacterial Blight. Proper water management and resistant varieties can mitigate risks.'),
(4, 'Soybean', 'Best practices for soybean: Plant in warm soil. Inoculate seeds with Rhizobium bacteria for nitrogen fixation. Good drainage is crucial. Rotate crops to prevent soil-borne diseases.', 'Common diseases: Soybean Rust, Sudden Death Syndrome (SDS), Frogeye Leaf Spot. Look for discoloration of leaves and stems.');

-- Inserting a mock user for easy login and testing
-- Username: 'farmer_john', Password: 'password123'
-- The password has been pre-hashed using BCrypt.
INSERT IGNORE INTO users (id, username, password) VALUES
(1, 'farmer_john', '$2a$10$EAX1i09L9pFTk.dGg9R3i.d/aI3G8.wTnrFbiYssD8LpJGXb/q/iS');

-- Inserting farm details for the mock user
INSERT IGNORE INTO farm (id, user_id, acres, soil_type, location, current_crop, expected_yield) VALUES
(1, 1, 150.5, 'Clay Loam', 'Davis', 'Corn', 300);

