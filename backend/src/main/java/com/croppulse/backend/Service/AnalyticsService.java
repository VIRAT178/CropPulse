package com.croppulse.backend.Service;

import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.croppulse.backend.Model.Recommendation;
import com.croppulse.backend.Repos.RecommendationRepo;
import com.croppulse.backend.dto.ChartValueDTO;
import com.croppulse.backend.dto.ConfidencePointDTO;
import com.croppulse.backend.dto.PricePointDTO;

@Service
public class AnalyticsService {

    private final RecommendationRepo recommendationRepo;

    public AnalyticsService(RecommendationRepo recommendationRepo) {
        this.recommendationRepo = recommendationRepo;
    }

    public List<PricePointDTO> getPriceBarData(int limit) {
        var page = PageRequest.of(0, Math.max(limit, 1), Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Recommendation> recs = recommendationRepo.findAll(page).getContent();
        return recs.stream()
                .map(r -> new PricePointDTO(r.getRecommendedCrop(),
                        r.getExpectedPrice() != null ? r.getExpectedPrice() : 0.0))
                .collect(Collectors.toList());
    }

    public List<ChartValueDTO> getRiskDistribution() {
        List<Recommendation> recs = recommendationRepo.findAll();
        Map<String, Integer> counts = new HashMap<>();
        counts.put("Low", 0);
        counts.put("Medium", 0);
        counts.put("High", 0);

        for (Recommendation r : recs) {
            String level = r.getRiskLevel();
            if (level == null) continue;
            String key = switch (level.toLowerCase()) {
                case "low" -> "Low";
                case "medium" -> "Medium";
                case "high" -> "High";
                default -> null;
            };
            if (key != null) counts.put(key, counts.getOrDefault(key, 0) + 1);
        }

        List<ChartValueDTO> result = new ArrayList<>();
        result.add(new ChartValueDTO("Low", counts.get("Low")));
        result.add(new ChartValueDTO("Medium", counts.get("Medium")));
        result.add(new ChartValueDTO("High", counts.get("High")));
        return result;
    }

    public List<ConfidencePointDTO> getConfidenceTrend(int months) {
        List<Recommendation> recs = recommendationRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        Map<YearMonth, List<Double>> bucket = new HashMap<>();

        for (Recommendation r : recs) {
            if (r.getCreatedAt() == null || r.getConfidenceScore() == null) continue;
            YearMonth ym = YearMonth.from(r.getCreatedAt());
            bucket.computeIfAbsent(ym, k -> new ArrayList<>()).add(r.getConfidenceScore());
        }

        List<YearMonth> sorted = bucket.keySet().stream()
                .sorted((a, b) -> b.compareTo(a))
                .collect(Collectors.toList());

        List<ConfidencePointDTO> points = new ArrayList<>();
        int take = Math.min(months, sorted.size());
        for (int i = 0; i < take; i++) {
            YearMonth ym = sorted.get(i);
            List<Double> vals = bucket.get(ym);
            double avg = vals.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            String monthName = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            // Convert to percentage (0.65 -> 65) BEFORE converting to integer
            points.add(new ConfidencePointDTO(monthName, (int) Math.round(avg * 100)));
        }
        // reverse to chronological
        java.util.Collections.reverse(points);
        return points;
    }
}
