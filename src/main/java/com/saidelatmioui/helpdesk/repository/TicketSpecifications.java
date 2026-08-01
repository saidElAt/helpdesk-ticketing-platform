package com.saidelatmioui.helpdesk.repository;

import com.saidelatmioui.helpdesk.entity.Ticket;
import com.saidelatmioui.helpdesk.entity.TicketPriority;
import com.saidelatmioui.helpdesk.entity.TicketStatus;
import org.springframework.data.jpa.domain.Specification;

public final class TicketSpecifications {

    private TicketSpecifications() {
    }

    public static Specification<Ticket> withFilters(
            String search,
            TicketStatus status,
            TicketPriority priority,
            Long categoryId,
            Long assignedAgentId,
            Long customerId
    ) {
        return (root, query, criteriaBuilder) -> {
            var predicate = criteriaBuilder.conjunction();

            if (search != null && !search.isBlank()) {
                String pattern =
                        "%" + search.trim().toLowerCase() + "%";

                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                root.get("title")
                                        ),
                                        pattern
                                ),
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(
                                                root.get("description")
                                        ),
                                        pattern
                                )
                        )
                );
            }

            if (status != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("status"),
                                status
                        )
                );
            }

            if (priority != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("priority"),
                                priority
                        )
                );
            }

            if (categoryId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("category").get("id"),
                                categoryId
                        )
                );
            }

            if (assignedAgentId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("assignedAgent").get("id"),
                                assignedAgentId
                        )
                );
            }

            if (customerId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("customer").get("id"),
                                customerId
                        )
                );
            }

            return predicate;
        };
    }
}