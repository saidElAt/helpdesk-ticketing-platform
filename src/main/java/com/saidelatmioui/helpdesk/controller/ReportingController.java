package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.dto.TicketMetricsResponse;
import com.saidelatmioui.helpdesk.service.TicketMetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportingController {

    private final TicketMetricsService metricsService;

    public ReportingController(
            TicketMetricsService metricsService
    ) {
        this.metricsService = metricsService;
    }

    @GetMapping("/tickets/summary")
    public ResponseEntity<TicketMetricsResponse>
    getTicketSummaryReport() {
        return ResponseEntity.ok(
                metricsService.getMetrics()
        );
    }
}