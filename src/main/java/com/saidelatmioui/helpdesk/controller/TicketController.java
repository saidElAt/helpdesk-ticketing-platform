package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.dto.ChangeTicketStatusRequest;
import com.saidelatmioui.helpdesk.dto.CreateTicketRequest;
import com.saidelatmioui.helpdesk.dto.TicketResponse;
import com.saidelatmioui.helpdesk.dto.UpdateTicketRequest;
import com.saidelatmioui.helpdesk.entity.TicketPriority;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import com.saidelatmioui.helpdesk.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(
            TicketService ticketService
    ) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>>
    searchTickets(
            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            TicketStatus status,

            @RequestParam(required = false)
            TicketPriority priority,

            @RequestParam(required = false)
            Long categoryId,

            @RequestParam(required = false)
            Long assignedAgentId,

            @RequestParam(required = false)
            Long customerId
    ) {
        return ResponseEntity.ok(
                ticketService.searchTickets(
                        search,
                        status,
                        priority,
                        categoryId,
                        assignedAgentId,
                        customerId
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse>
    getTicketById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                ticketService.getTicketById(id)
        );
    }

    @PostMapping
    public ResponseEntity<TicketResponse>
    createTicket(
            @Valid
            @RequestBody
            CreateTicketRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ticketService.createTicket(
                                request
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketResponse>
    updateTicket(
            @PathVariable Long id,

            @Valid
            @RequestBody
            UpdateTicketRequest request,

            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ticketService.updateTicket(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponse>
    changeTicketStatus(
            @PathVariable Long id,

            @Valid
            @RequestBody
            ChangeTicketStatusRequest request,

            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ticketService.changeTicketStatus(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/{ticketId}/assign/{agentId}")
    public ResponseEntity<TicketResponse>
    assignTicket(
            @PathVariable Long ticketId,
            @PathVariable Long agentId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ticketService.assignTicket(
                        ticketId,
                        agentId,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @PathVariable Long id
    ) {
        ticketService.deleteTicket(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}