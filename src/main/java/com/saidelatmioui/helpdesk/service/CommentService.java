package com.saidelatmioui.helpdesk.service;

import com.saidelatmioui.helpdesk.dto.CommentResponse;
import com.saidelatmioui.helpdesk.dto.CreateCommentRequest;
import com.saidelatmioui.helpdesk.entity.Comment;
import com.saidelatmioui.helpdesk.entity.Ticket;
import com.saidelatmioui.helpdesk.entity.User;
import com.saidelatmioui.helpdesk.exception.ResourceNotFoundException;
import com.saidelatmioui.helpdesk.repository.CommentRepository;
import com.saidelatmioui.helpdesk.repository.TicketRepository;
import com.saidelatmioui.helpdesk.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForTicket(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ticket with ID " + ticketId + " was not found"
                        )
                );

        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticket.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CommentResponse createComment(
            Long ticketId,
            CreateCommentRequest request
    ) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ticket with ID " + ticketId + " was not found"
                        )
                );

        User author = userRepository.findById(request.getAuthorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " + request.getAuthorId() + " was not found"
                        )
                );

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(request.getContent().trim());

        return toResponse(commentRepository.save(comment));
    }

    private CommentResponse toResponse(Comment comment) {

        CommentResponse response = new CommentResponse();

        response.setId(comment.getId());
        response.setTicketId(comment.getTicket().getId());
        response.setAuthorId(comment.getAuthor().getId());

        response.setAuthorName(
                comment.getAuthor().getFirstName()
                        + " "
                        + comment.getAuthor().getLastName()
        );

        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());

        return response;
    }
}