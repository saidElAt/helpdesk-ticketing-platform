package com.saidelatmioui.helpdesk.repository;

import com.saidelatmioui.helpdesk.entity.Ticket;
import com.saidelatmioui.helpdesk.entity.TicketPriority;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TicketRepository
        extends JpaRepository<Ticket, Long>,
        JpaSpecificationExecutor<Ticket> {

    long countByStatus(TicketStatus status);

    long countByPriority(TicketPriority priority);

    long countByAssignedAgentIsNull();

    long countByAssignedAgentIsNotNull();
}