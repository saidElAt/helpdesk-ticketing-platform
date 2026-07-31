package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.dto.TicketStatusHistoryResponse;
import com.saidelatmioui.helpdesk.entity.Ticket;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import com.saidelatmioui.helpdesk.entity.TicketStatusHistory;
import com.saidelatmioui.helpdesk.entity.User;
import com.saidelatmioui.helpdesk.exception.ResourceNotFoundException;
import com.saidelatmioui.helpdesk.repository.TicketRepository;
import com.saidelatmioui.helpdesk.repository.TicketStatusHistoryRepository;
import com.saidelatmioui.helpdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TicketStatusHistoryService {

    private final TicketStatusHistoryRepository historyRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketStatusHistoryService(
            TicketStatusHistoryRepository historyRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.historyRepository = historyRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TicketStatusHistoryResponse> getHistoryForTicket(
            Long ticketId
    ) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket with ID " + ticketId + " was not found"
                ));

        return historyRepository
                .findByTicketIdOrderByChangedAtAsc(ticket.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void recordStatusChange(
            Ticket ticket,
            TicketStatus oldStatus,
            TicketStatus newStatus,
            String changedByEmail
    ) {
        User changedBy = userRepository
                .findByEmailIgnoreCase(changedByEmail)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with email "
                                + changedByEmail
                                + " was not found"
                ));

        TicketStatusHistory history = new TicketStatusHistory();
        history.setTicket(ticket);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);

        historyRepository.save(history);
    }

    private TicketStatusHistoryResponse toResponse(
            TicketStatusHistory history
    ) {
        TicketStatusHistoryResponse response =
                new TicketStatusHistoryResponse();

        response.setId(history.getId());
        response.setTicketId(history.getTicket().getId());
        response.setOldStatus(history.getOldStatus());
        response.setNewStatus(history.getNewStatus());
        response.setChangedAt(history.getChangedAt());

        if (history.getChangedBy() != null) {
            response.setChangedById(
                    history.getChangedBy().getId()
            );

            response.setChangedByName(
                    history.getChangedBy().getFirstName()
                            + " "
                            + history.getChangedBy().getLastName()
            );
        }

        return response;
    }
}