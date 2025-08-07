package com.fitgenius;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot application class for FitGenius Hub
 * 
 * This application provides a comprehensive fitness platform with:
 * - User authentication and authorization
 * - Workout tracking and management
 * - Nutrition planning and monitoring
 * - AI-powered chatbot for fitness advice
 * - Real-time communication via WebSocket
 * - Social features and community engagement
 * 
 * @author FitGenius Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class FitGeniusApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitGeniusApplication.class, args);
    }
} 