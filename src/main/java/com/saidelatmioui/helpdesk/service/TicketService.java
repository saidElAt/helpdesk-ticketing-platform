package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.dto.ChangeTicketStatusRequest;
import com.saidelatmioui.helpdesk.dto.CreateTicketRequest;
import com.saidelatmioui.helpdesk.dto.TicketResponse;
import com.saidelatmioui.helpdesk.dto.UpdateTicketRequest;
import com.saidelatmioui.helpdesk.entity.Ticket;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import com.saidelatmioui.helpdesk.entity.User;
import com.saidelatmioui.helpdesk.exception.BadRequestException;
import com.saidelatmioui.helpdesk.exception.ResourceNotFoundException;
import com.saidelatmioui.helpdesk.repository.TicketRepository;
import com.saidelatmioui.helpdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TicketService {

    private static final String AGENT_ROLE = "AGENT";

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        return toResponse(findTicketById(id));
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer with ID "
                                + request.getCustomerId()
                                + " was not found"
                ));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCustomer(customer);

        return toResponse(ticketRepository.save(ticket));
    }

    public TicketResponse updateTicket(
            Long id,
            UpdateTicketRequest request
    ) {
        Ticket ticket = findTicketById(id);

        ticket.setTitle(request.getTitle().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setPriority(request.getPriority());

        return toResponse(ticketRepository.save(ticket));
    }

    public TicketResponse changeTicketStatus(
            Long id,
            ChangeTicketStatusRequest request
    ) {
        Ticket ticket = findTicketById(id);

        ticket.setStatus(request.getStatus());

        return toResponse(ticketRepository.save(ticket));
    }

    public TicketResponse assignTicket(
            Long ticketId,
            Long agentId
    ) {
        Ticket ticket = findTicketById(ticketId);

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User with ID " + agentId + " was not found"
                ));

        validateAgent(agent);

        ticket.setAssignedAgent(agent);

        if (ticket.getStatus() == TicketStatus.OPEN) {
            ticket.setStatus(TicketStatus.IN_PROGRESS);
        }

        return toResponse(ticketRepository.save(ticket));
    }

    public void deleteTicket(Long id) {
        Ticket ticket = findTicketById(id);
        ticketRepository.delete(ticket);
    }

    private Ticket findTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket with ID " + id + " was not found"
                ));
    }

    private void validateAgent(User user) {
        if (user.getRole() == null
                || user.getRole().getName() == null
                || !AGENT_ROLE.equalsIgnoreCase(user.getRole().getName())) {
            throw new BadRequestException(
                    "User with ID " + user.getId()
                            + " cannot be assigned because the user is not an AGENT"
            );
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new BadRequestException(
                    "User with ID " + user.getId()
                            + " cannot be assigned because the user is disabled"
            );
        }
    }

    private TicketResponse toResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();

        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setStatus(ticket.getStatus());
        response.setPriority(ticket.getPriority());
        response.setCustomerId(ticket.getCustomer().getId());

        if (ticket.getAssignedAgent() != null) {
            response.setAssignedAgentId(
                    ticket.getAssignedAgent().getId()
            );
        }

        return response;
    }
}