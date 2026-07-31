package com.saidelatmioui.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotNull(message = "Author ID is required")
    @Positive(message = "Author ID must be greater than zero")
    private Long authorId;

    @NotBlank(message = "Comment content is required")
    @Size(
            min = 2,
            max = 5000,
            message = "Comment must contain between 2 and 5000 characters"
    )
    private String content;

    public CreateCommentRequest() {
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}