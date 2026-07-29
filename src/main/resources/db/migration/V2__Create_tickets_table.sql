CREATE TABLE tickets
(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    status VARCHAR(50) NOT NULL,

    priority VARCHAR(50) NOT NULL,

    customer_id BIGINT NOT NULL,

    assigned_agent_id BIGINT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_customer
        FOREIGN KEY (customer_id)
            REFERENCES users(id),

    CONSTRAINT fk_ticket_agent
        FOREIGN KEY (assigned_agent_id)
            REFERENCES users(id)
);