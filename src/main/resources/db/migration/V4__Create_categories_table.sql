CREATE TABLE categories
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500) NULL,
    enabled     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO categories (
    name,
    description,
    enabled
)
VALUES
    (
        'ACCOUNT',
        'Login, password, profile, and account access issues',
        TRUE
    ),
    (
        'HARDWARE',
        'Problems related to computers, printers, and physical devices',
        TRUE
    ),
    (
        'SOFTWARE',
        'Application errors, installation issues, and software failures',
        TRUE
    ),
    (
        'NETWORK',
        'Internet, connectivity, VPN, and network access problems',
        TRUE
    ),
    (
        'OTHER',
        'General requests that do not match another category',
        TRUE
    );