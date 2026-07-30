package com.saidelatmioui.helpdesk.dto;

import com.saidelatmioui.helpdesk.entity.TicketStatus;
import jakarta.validation.constraints.NotNull;

public class ChangeTicketStatusRequest {

    @NotNull(message = "Status is required")
    private TicketStatus status;

    public ChangeTicketStatusRequest() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}