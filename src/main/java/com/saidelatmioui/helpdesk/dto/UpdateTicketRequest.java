package com.saidelatmioui.helpdesk.dto;

import com.saidelatmioui.helpdesk.entity.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateTicketRequest {

    @NotBlank(message = "Title is required")
    @Size(
            min = 5,
            max = 150,
            message = "Title must contain between 5 and 150 characters"
    )
    private String title;

    @NotBlank(message = "Description is required")
    @Size(
            min = 10,
            max = 5000,
            message = "Description must contain between 10 and 5000 characters"
    )
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    public UpdateTicketRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
}