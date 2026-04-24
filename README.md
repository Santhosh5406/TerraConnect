<<<<<<< HEAD
# 🌿 TerraConnect

**Modern Approaches for Sustained Farming**

TerraConnect is a modernized, full-stack Polyculture Farming advisor application designed to provide rural and large-scale agricultural operations with deeply localized crop intelligence, precision agriculture data, and soil sustainability forecasting.

Built entirely independently of paid AI-APIs, TerraConnect leverages a massive proprietary hardcoded logic engine to analyze local farm mechanics (acreage, soil quality, polyculture diversity) and immediately calculate sustainability scores, predict gross water requirements, and rigorously recommend "Phase Shift" crop rotations using agricultural best practices.

## ✨ Core Features

*   **🌍 Comprehensive Offline Internalization (i18n):** Supports live, dynamic toggle translation across 11+ key regional languages (*Tamil, Hindi, Malayalam, Telugu, Urdu, Kannada, Bengali, Marathi, Odia, Gujarati, English*) utilizing a proprietary localized JSON translation matrix without relying on web APIs.
*   **🌱 Extensive Crop Intelligence Database:** Deeply modeled support for 12 essential staple crops (Wheat, Rice, Sugarcane, Tomatoes, Soybean, Millets, Bananas, Cotton, Groundnut, etc.). It documents detailed best practices, biological threats, ideal pH envelopes, companion planting, and exact fertilizer/pesticide NPK recommendations.
*   **♻️ Phase-Shift Rotation Engine:** Dynamically calculates mathematical crop rotation. Recognizing heavy nitrogen-feeders (like Corn or Sugarcane) and immediately recommending restorative Legumes, or detecting Legumes and shifting you towards leafy greens.
*   **📊 Dynamic Sustainability Heuristic Engine:** Calculates an active score (/100) based on strict parameters: penalizing heavy water usage, boosting scores for soil-healing cover/legume crops, and applying algorithmic bonuses for dense polyculture planting.
*   **☀️ OpenWeather API Integration:** Features a robust 5-day Weather Forecast Tracking matrix embedded dynamically inside the Dashboard to track precipitation probabilities against crop growth cycles.
*   **💽 Hardened SQL Synchronization:** Bootstraps massive offline datasets on startup into MySQL entities utilizing Hibernate/JPA ensuring data persists flawlessly from the JSON logic envelope direct to the database.

## 🛠️ Technology Stack

**Frontend Architecture:**
*   **React 18** (Vite build engine)
*   **TailwindCSS** for responsive, mobile-first styling utilizing a "glassmorphism" aesthetic template.
*   **Framer Motion** for liquid micro-animations and component fading transitions.
*   **Lucide-React** for iconography.
*   **Dynamic Context API** for real-time `lang` UI overriding.

**Backend Architecture:**
*   **Java 17 (Spring Boot 3.x)** 
*   **Spring Data JPA** / Hibernate ORM for relational mapping.
*   **Jackson** for raw JSON offline file stream parsing (`translations.json`).
*   **MySQL Server** for complex data warehousing (Farm entities, Crop details).

## 🚀 Installation & Setup

### Prerequisites
*   Node.js (`>=18.x`)
*   Java Development Kit (JDK) 17+
*   MySQL Server (Ensure the daemon is running locally)

### 1. Database Setup
Launch your MySQL terminal or Workbench and create the initial database schema:
```sql
CREATE DATABASE terra_db;
```
*(The backend `application.properties` uses `root` with no password by default. Adjust if your local SQL user has custom credentials)*.

### 2. Spring Boot Backend
Navigate into the `backend/` directory from this repository's root.
1. Use Maven to compile and start the server.
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*Note: Because TerraConnect uses a static resource engine for Phase shifting, any updates to the `translations.json` matrix or `CropService.java` routing require a complete restart of the Spring runtime.*

### 3. Vite React Frontend
Navigate into the `frontend/` directory.
1. Install the required Node modules.
```bash
cd frontend
npm install
```
2. Start the local Hot-Module-Replacement (HMR) development server.
```bash
npm run dev
```

## 📝 License
This project was designed for open-source agricultural improvement strategies. Feel free to fork, expand the Crop Intelligence DB, and optimize translation dictionaries!
=======
# TerraConnect
>>>>>>> 3cf7113013d1ca8112aae75da30b394fa0dfa646
