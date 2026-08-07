package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.dto.ChangeTicketStatusRequest;
import com.saidelatmioui.helpdesk.dto.CreateTicketRequest;
import com.saidelatmioui.helpdesk.dto.TicketResponse;
import com.saidelatmioui.helpdesk.dto.UpdateTicketRequest;
import com.saidelatmioui.helpdesk.entity.Category;
import com.saidelatmioui.helpdesk.entity.Ticket;
import com.saidelatmioui.helpdesk.entity.TicketPriority;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import com.saidelatmioui.helpdesk.entity.User;
import com.saidelatmioui.helpdesk.exception.BadRequestException;
import com.saidelatmioui.helpdesk.exception.ResourceNotFoundException;
import com.saidelatmioui.helpdesk.repository.CategoryRepository;
import com.saidelatmioui.helpdesk.repository.TicketRepository;
import com.saidelatmioui.helpdesk.repository.TicketSpecifications;
import com.saidelatmioui.helpdesk.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TicketService {

    private static final String CUSTOMER_ROLE = "CUSTOMER";
    private static final String AGENT_ROLE = "AGENT";
    private static final String ADMIN_ROLE = "ADMIN";

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final TicketStatusHistoryService historyService;

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            TicketStatusHistoryService historyService
    ) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.historyService = historyService;
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> searchTickets(
            String search,
            TicketStatus status,
            TicketPriority priority,
            Long categoryId,
            Long assignedAgentId,
            Long customerId
    ) {
        return ticketRepository.findAll(
                        TicketSpecifications.withFilters(
                                search,
                                status,
                                priority,
                                categoryId,
                                assignedAgentId,
                                customerId
                        )
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id) {
        return toResponse(findTicketById(id));
    }

    public TicketResponse createTicket(
            CreateTicketRequest request
    ) {
        User customer = userRepository
                .findById(request.getCustomerId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer with ID "
                                        + request.getCustomerId()
                                        + " was not found"
                        )
                );

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category with ID "
                                        + request.getCategoryId()
                                        + " was not found"
                        )
                );

        if (!Boolean.TRUE.equals(category.getEnabled())) {
            throw new BadRequestException(
                    "Category with ID "
                            + category.getId()
                            + " is disabled"
            );
        }

        Ticket ticket = new Ticket();

        ticket.setTitle(
                request.getTitle().trim()
        );

        ticket.setDescription(
                request.getDescription().trim()
        );

        ticket.setPriority(
                request.getPriority()
        );

        ticket.setStatus(
                TicketStatus.OPEN
        );

        ticket.setCustomer(
                customer
        );

        ticket.setCategory(
                category
        );

        Ticket savedTicket =
                ticketRepository.save(ticket);

        historyService.recordStatusChange(
                savedTicket,
                null,
                TicketStatus.OPEN,
                customer.getEmail()
        );

        return toResponse(savedTicket);
    }

    public TicketResponse updateTicket(
            Long id,
            UpdateTicketRequest request,
            String authenticatedEmail
    ) {
        Ticket ticket = findTicketById(id);

        User authenticatedUser = userRepository
                .findByEmailIgnoreCase(authenticatedEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user was not found"
                        )
                );

        validateTicketUpdatePermission(
                ticket,
                authenticatedUser
        );

        Category category = categoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category with ID "
                                        + request.getCategoryId()
                                        + " was not found"
                        )
                );

        if (!Boolean.TRUE.equals(category.getEnabled())) {
            throw new BadRequestException(
                    "Category with ID "
                            + category.getId()
                            + " is disabled"
            );
        }

        ticket.setTitle(
                request.getTitle().trim()
        );

        ticket.setDescription(
                request.getDescription().trim()
        );

        ticket.setPriority(
                request.getPriority()
        );

        ticket.setCategory(
                category
        );

        return toResponse(
                ticketRepository.save(ticket)
        );
    }

    public TicketResponse changeTicketStatus(
            Long id,
            ChangeTicketStatusRequest request,
            String changedByEmail
    ) {
        Ticket ticket = findTicketById(id);

        TicketStatus oldStatus =
                ticket.getStatus();

        TicketStatus newStatus =
                request.getStatus();

        if (oldStatus == newStatus) {
            return toResponse(ticket);
        }

        ticket.setStatus(newStatus);

        Ticket savedTicket =
                ticketRepository.save(ticket);

        historyService.recordStatusChange(
                savedTicket,
                oldStatus,
                newStatus,
                changedByEmail
        );

        return toResponse(savedTicket);
    }

    public TicketResponse assignTicket(
            Long ticketId,
            Long agentId,
            String changedByEmail
    ) {
        Ticket ticket =
                findTicketById(ticketId);

        User agent = userRepository
                .findById(agentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID "
                                        + agentId
                                        + " was not found"
                        )
                );

        validateAgent(agent);

        ticket.setAssignedAgent(agent);

        TicketStatus oldStatus =
                ticket.getStatus();

        if (oldStatus == TicketStatus.OPEN) {
            ticket.setStatus(
                    TicketStatus.IN_PROGRESS
            );
        }

        Ticket savedTicket =
                ticketRepository.save(ticket);

        if (oldStatus != savedTicket.getStatus()) {
            historyService.recordStatusChange(
                    savedTicket,
                    oldStatus,
                    savedTicket.getStatus(),
                    changedByEmail
            );
        }

        return toResponse(savedTicket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket =
                findTicketById(id);

        ticketRepository.delete(ticket);
    }

    private Ticket findTicketById(Long id) {
        return ticketRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ticket with ID "
                                        + id
                                        + " was not found"
                        )
                );
    }

    private void validateTicketUpdatePermission(
            Ticket ticket,
            User authenticatedUser
    ) {
        if (
                authenticatedUser.getRole() == null
                        || authenticatedUser.getRole().getName() == null
        ) {
            throw new AccessDeniedException(
                    "You do not have permission to edit this ticket"
            );
        }

        String roleName =
                authenticatedUser.getRole().getName();

        if (
                ADMIN_ROLE.equalsIgnoreCase(roleName)
                        || AGENT_ROLE.equalsIgnoreCase(roleName)
        ) {
            return;
        }

        if (!CUSTOMER_ROLE.equalsIgnoreCase(roleName)) {
            throw new AccessDeniedException(
                    "You do not have permission to edit this ticket"
            );
        }

        if (
                ticket.getCustomer() == null
                        || !ticket.getCustomer()
                        .getId()
                        .equals(authenticatedUser.getId())
        ) {
            throw new AccessDeniedException(
                    "Customers may only edit their own tickets"
            );
        }

        if (
                ticket.getStatus() != TicketStatus.OPEN
                        && ticket.getStatus()
                        != TicketStatus.IN_PROGRESS
        ) {
            throw new AccessDeniedException(
                    "Customers may only edit tickets that are OPEN or IN_PROGRESS"
            );
        }
    }

    private void validateAgent(User user) {
        if (
                user.getRole() == null
                        || user.getRole().getName() == null
                        || !AGENT_ROLE.equalsIgnoreCase(
                        user.getRole().getName()
                )
        ) {
            throw new BadRequestException(
                    "User with ID "
                            + user.getId()
                            + " cannot be assigned because the user is not an AGENT"
            );
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new BadRequestException(
                    "User with ID "
                            + user.getId()
                            + " cannot be assigned because the user is disabled"
            );
        }
    }

    private TicketResponse toResponse(
            Ticket ticket
    ) {
        TicketResponse response =
                new TicketResponse();

        response.setId(
                ticket.getId()
        );

        response.setTitle(
                ticket.getTitle()
        );

        response.setDescription(
                ticket.getDescription()
        );

        response.setStatus(
                ticket.getStatus()
        );

        response.setPriority(
                ticket.getPriority()
        );

        User customer =
                ticket.getCustomer();

        response.setCustomerId(
                customer.getId()
        );

        response.setCustomerName(
                buildFullName(customer)
        );

        response.setCustomerEmail(
                customer.getEmail()
        );

        User assignedAgent =
                ticket.getAssignedAgent();

        if (assignedAgent != null) {
            response.setAssignedAgentId(
                    assignedAgent.getId()
            );

            response.setAssignedAgentName(
                    buildFullName(assignedAgent)
            );

            response.setAssignedAgentEmail(
                    assignedAgent.getEmail()
            );
        }

        response.setCategoryId(
                ticket.getCategory().getId()
        );

        response.setCategoryName(
                ticket.getCategory().getName()
        );

        return response;
    }

    private String buildFullName(User user) {
        return (
                user.getFirstName()
                        + " "
                        + user.getLastName()
        ).trim();
    }
}