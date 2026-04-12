package com.farm.management.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TranslationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String translate(String text, String targetLang) {
        if (text == null || text.isEmpty() || "en".equalsIgnoreCase(targetLang)) {
            return text;
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://translate.googleapis.com/translate_a/single")
                    .queryParam("client", "gtx")
                    .queryParam("sl", "en")
                    .queryParam("tl", targetLang)
                    .queryParam("dt", "t")
                    .queryParam("q", text)
                    .toUriString();

            String response = restTemplate.getForObject(url, String.class);
            
            // The response is a nested JSON array, something like [[["Text", "Texto", null, null, 1]]]
            JsonNode root = objectMapper.readTree(response);
            JsonNode textArray = root.get(0);
            
            StringBuilder translatedText = new StringBuilder();
            if (textArray != null && textArray.isArray()) {
                for (JsonNode node : textArray) {
                    translatedText.append(node.get(0).asText());
                }
            }
            
            return translatedText.toString();
        } catch (Exception e) {
            System.err.println("Translation failed for text: " + text + ". Reason: " + e.getMessage());
            return text; // Fallback to English
        }
    }
}
