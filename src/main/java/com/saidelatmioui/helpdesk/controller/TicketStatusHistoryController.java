package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.dto.TicketStatusHistoryResponse;
import com.saidelatmioui.helpdesk.service.TicketStatusHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets/{ticketId}/history")
public class TicketStatusHistoryController {

    private final TicketStatusHistoryService historyService;

    public TicketStatusHistoryController(
            TicketStatusHistoryService historyService
    ) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<TicketStatusHistoryResponse>>
    getHistoryForTicket(
            @PathVariable Long ticketId
    ) {
        return ResponseEntity.ok(
                historyService.getHistoryForTicket(ticketId)
        );
    }
}