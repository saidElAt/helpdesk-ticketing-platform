ALTER TABLE tickets
    ADD COLUMN category_id BIGINT NULL;

UPDATE tickets
SET category_id = (
    SELECT id
    FROM categories
    WHERE name = 'OTHER'
)
WHERE category_id IS NULL;

ALTER TABLE tickets
    MODIFY category_id BIGINT NOT NULL;

ALTER TABLE tickets
    ADD CONSTRAINT fk_ticket_category
        FOREIGN KEY (category_id)
            REFERENCES categories(id);