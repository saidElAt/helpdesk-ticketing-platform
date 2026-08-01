package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.dto.TicketMetricsResponse;
import com.saidelatmioui.helpdesk.service.TicketMetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final TicketMetricsService metricsService;

    public DashboardController(
            TicketMetricsService metricsService
    ) {
        this.metricsService = metricsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<TicketMetricsResponse>
    getDashboardSummary() {
        return ResponseEntity.ok(
                metricsService.getMetrics()
        );
    }
}