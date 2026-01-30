package com.croppulse.backend.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.croppulse.backend.Service.AnalyticsService;
import com.croppulse.backend.dto.ChartValueDTO;
import com.croppulse.backend.dto.ConfidencePointDTO;
import com.croppulse.backend.dto.PricePointDTO;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/prices")
    public List<PricePointDTO> getPrices(@RequestParam(defaultValue = "10") int limit) {
        return analyticsService.getPriceBarData(limit);
    }

    @GetMapping("/risk-distribution")
    public List<ChartValueDTO> getRiskDistribution() {
        return analyticsService.getRiskDistribution();
    }

    @GetMapping("/confidence-trend")
    public List<ConfidencePointDTO> getConfidenceTrend(@RequestParam(defaultValue = "6") int months) {
        return analyticsService.getConfidenceTrend(months);
    }
}
