package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.dto.TicketMetricsResponse;
import com.saidelatmioui.helpdesk.entity.TicketPriority;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import com.saidelatmioui.helpdesk.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TicketMetricsService {

    private final TicketRepository ticketRepository;

    public TicketMetricsService(
            TicketRepository ticketRepository
    ) {
        this.ticketRepository =
                ticketRepository;
    }

    public TicketMetricsResponse getMetrics() {
        TicketMetricsResponse response =
                new TicketMetricsResponse();

        response.setTotalTickets(
                ticketRepository.count()
        );

        response.setOpenTickets(
                ticketRepository.countByStatus(
                        TicketStatus.OPEN
                )
        );

        response.setInProgressTickets(
                ticketRepository.countByStatus(
                        TicketStatus.IN_PROGRESS
                )
        );

        response.setResolvedTickets(
                ticketRepository.countByStatus(
                        TicketStatus.RESOLVED
                )
        );

        response.setClosedTickets(
                ticketRepository.countByStatus(
                        TicketStatus.CLOSED
                )
        );

        response.setLowPriorityTickets(
                ticketRepository.countByPriority(
                        TicketPriority.LOW
                )
        );

        response.setMediumPriorityTickets(
                ticketRepository.countByPriority(
                        TicketPriority.MEDIUM
                )
        );

        response.setHighPriorityTickets(
                ticketRepository.countByPriority(
                        TicketPriority.HIGH
                )
        );

        response.setCriticalPriorityTickets(
                ticketRepository.countByPriority(
                        TicketPriority.CRITICAL
                )
        );

        response.setAssignedTickets(
                ticketRepository
                        .countByAssignedAgentIsNotNull()
        );

        response.setUnassignedTickets(
                ticketRepository
                        .countByAssignedAgentIsNull()
        );

        return response;
    }
}