CREATE TABLE ticket_status_history
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id   BIGINT      NOT NULL,
    old_status  VARCHAR(50) NULL,
    new_status  VARCHAR(50) NOT NULL,
    changed_by  BIGINT      NULL,
    changed_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_status_history_ticket
        FOREIGN KEY (ticket_id)
            REFERENCES tickets(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_ticket_status_history_user
        FOREIGN KEY (changed_by)
            REFERENCES users(id)
);