package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {
    
    @Id
    private String playerId;
    
    private int currentLevel;
    
    private String gameState;
    
    private LocalDateTime lastUpdated;
} 