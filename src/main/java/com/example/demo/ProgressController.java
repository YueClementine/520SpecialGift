package com.example.demo;

import com.example.demo.model.Progress;
import com.example.demo.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressRepository progressRepository;

    @GetMapping("/{playerId}")
    public ResponseEntity<Progress> getProgress(@PathVariable String playerId) {
        Optional<Progress> progress = progressRepository.findById(playerId);
        return progress.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Progress> saveProgress(@RequestBody Progress progress) {
        progress.setLastUpdated(LocalDateTime.now());
        Progress savedProgress = progressRepository.save(progress);
        return ResponseEntity.ok(savedProgress);
    }
} 