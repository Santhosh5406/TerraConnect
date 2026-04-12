-- This file pre-populates the database with some crop information.
-- It will be executed automatically by Spring Boot on startup.

INSERT IGNORE INTO crop_info (id, crop_name, best_practices, potential_diseases, common_pests, fertilizer_recommendation, general_info, pesticide_recommendation) VALUES
(1, 'Wheat', 'Best sown in well-drained loamy soil. Requires consistent moisture. Cold stratification helps.', 'Rust, Powdery Mildew, Smut', 'Aphids, Hessian Fly', 'Balanced NPK (10-20-10) with emphasis on Phosphorus', 'Major winter cereal crop providing significant caloric density.', 'Fungicides like tebuconazole'),
(2, 'Corn', 'Requires rich, well-drained soil and plenty of sun. Plant in tight blocks for pollination.', 'Smut, Gray Leaf Spot, Northern Corn Leaf Blight', 'Corn Earworm, Aphids', 'High Nitrogen NPK 20-10-10 or aged manure', 'Globally dominant cereal grain requiring significant nutrients.', 'Neem oil for aphids, Bt for caterpillars'),
(3, 'Rice', 'Typically grown in flooded paddies. Requires consistent water depth.', 'Blast, Sheath Blight, Bacterial Blight', 'Stem Borer, Brown Planthopper', 'Urea splits during tillering', 'Primary staple for over half the global population.', 'Standard carbamates for stem borers'),
(4, 'Soybean', 'Adaptable to various soils but prefer loam. Inoculate seeds with Rhizobium.', 'Soybean Rust, Downy Mildew, White Mold', 'Stinkbugs, Soybean Aphids', 'Phosphorus and Potassium focused; nitrogen is self-fixed', 'Critical global protein and oil source.', 'General insecticides for stinkbugs'),
(5, 'Sugarcane', 'Thrives in deep, rich Alluvial and Black soils. Requires intense irrigation.', 'Red Rot, Smut, Wilt. Ensure disease-free sets are used.', 'Shoot Borer, Termites, Woolly Aphid', 'High Nitrogen, applied in splits', 'Major cash crop and primary source of sugar globally.', 'Chlorantraniliprole for early shoot borers'),
(6, 'Cotton', 'Ideal in deep Black soil. Avoid waterlogging during flowering.', 'Fusarium wilt and cotton leaf curl virus.', 'Boll Weevil, Pink Bollworm', 'High Nitrogen and Potassium throughout friting cycles', 'Worlds leading natural fiber crop.', 'Historically heavy reliance; consider BT-cotton strains'),
(7, 'Pearl Millet (Bajra)', 'Highly drought-tolerant, best suited for sandy soils.', 'Downy Mildew, Ergot, Smut.', 'Shoot fly, Stem Borer', 'Minimal requirements, light nitrogen applications', 'Ancient group of small-seeded grains, climate resilient.', 'Rarely requires heavy pesticides'),
(8, 'Groundnut', 'Plant in loose, friable soil to allow peg penetration.', 'Tikka disease (Leaf Spot), Rust.', 'Aphids, White Grub', 'High Calcium requirement (Gypsum 500kg/ha)', 'Unique legume where flowers bury underground.', 'Imidacloprid for sucking pests'),
(9, 'Chickpea (Chana)', 'Grown best in Black or Red soils as a rabi crop.', 'Fusarium Wilt, Ascochyta Blight', 'Pod Borer', 'Phosphorus rich fertilizer', 'Important legume with high protein content.', 'Neem-based repellents'),
(10, 'Onion', 'Soil should be loose, well-draining. Cultivation requires precise day-length knowledge.', 'Downy Mildew, Neck Rot', 'Onion Maggots, Thrips', 'Nitrogen-rich fertilizer immediately after planting', 'Dietary staple globally.', 'Pyrethrin for onion maggots'),
(11, 'Tomato', 'Prefers loamy soils. Requires excellent drainage and staking.', 'Late Blight, Early Blight, Blossom End Rot', 'Tomato Hornworm, Whiteflies', 'Phosphorus and Potassium heavy mix', 'Versatile nightshade fruit.', 'Spinosad for hornworms, Neem oil'),
(12, 'Banana', 'Thrives in deep alluvial soil with excellent moisture retention.', 'Panama Wilt, Sigatoka Leaf Spot', 'Banana Weevil, Nematodes', 'Extremely high Potassium demand', 'Giant herbaceous plant producing massive fruit bunches.', 'Neem extracts or specialized nematicides'),
(13, 'Mango', 'Tolerant of various soils but prefers deep laterite.', 'Powdery Mildew, Anthracnose', 'Mango Hopper, Fruit Fly', 'NPK during flowering', 'King of fruits in tropical regions.', 'Bavistin for anthracnose'),
(14, 'Potato', 'Plant certified seed potatoes in loose soil. Hilling is critical.', 'Late Blight, Scab', 'Colorado Potato Beetle', 'Balanced NPK (10-10-10)', 'Important starchy root vegetable worldwide.', 'Spinosad for beetles');


INSERT IGNORE INTO users (id, username, password) VALUES
(1, 'farmer_john', '$2a$10$EAX1i09L9pFTk.dGg9R3i.d/aI3G8.wTnrFbiYssD8LpJGXb/q/iS');

INSERT IGNORE INTO farm (id, user_id, acres, soil_type, location) VALUES
(1, 1, 150.5, 'Clay Loam', 'Davis');

INSERT IGNORE INTO farm_crops (farm_id, crop_name, acres_allocated, expected_yield) VALUES
(1, 'Corn', 100.0, 200.0),
(1, 'Soybean', 50.5, 100.0);
