CREATE TABLE comments
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id  BIGINT    NOT NULL,
    author_id  BIGINT    NOT NULL,
    content    TEXT      NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_ticket
        FOREIGN KEY (ticket_id)
            REFERENCES tickets(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id)
            REFERENCES users(id)
);