package com.saidelatmioui.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotBlank(message = "Comment content is required")
    @Size(
            min = 2,
            max = 5000,
            message = "Comment must contain between 2 and 5000 characters"
    )
    private String content;

    public CreateCommentRequest() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}