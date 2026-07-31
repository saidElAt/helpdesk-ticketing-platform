package com.saidelatmioui.helpdesk.controller;

import com.saidelatmioui.helpdesk.dto.CommentResponse;
import com.saidelatmioui.helpdesk.dto.CreateCommentRequest;
import com.saidelatmioui.helpdesk.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets/{ticketId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(
            CommentService commentService
    ) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getCommentsForTicket(
            @PathVariable Long ticketId
    ) {
        return ResponseEntity.ok(
                commentService.getCommentsForTicket(ticketId)
        );
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        commentService.createComment(
                                ticketId,
                                request
                        )
                );
    }
}