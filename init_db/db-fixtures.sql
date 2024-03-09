CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(256),
    phone VARCHAR(11) UNIQUE NOT NULL
);

CREATE TABLE specialization (
    id SERIAL PRIMARY KEY,
    spec_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE doctor (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    surname VARCHAR(50),
    specialization_id INTEGER,
    CONSTRAINT specialization_fk FOREIGN KEY (specialization_id) REFERENCES specialization(id)
);

CREATE TABLE visit_time (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER,
    app_user_id INTEGER,
    time_start TIMESTAMP NOT NULL,
    time_end TIMESTAMP NOT NULL,
    CONSTRAINT doctor_fk FOREIGN KEY (doctor_id) REFERENCES doctor(id),
    CONSTRAINT app_user_fk FOREIGN KEY (app_user_id) REFERENCES app_user(id)
);

-- Add fixtures
INSERT INTO specialization (spec_name) VALUES
    ('Cardiologist'),
    ('Dentist'),
    ('Dermatologist'),
    ('General Practitioner');

INSERT INTO app_user (username, phone) VALUES
    ('ann_d', '79991234567'),
    ('alexander_b', '79997654321');

INSERT INTO doctor (first_name, last_name, surname, specialization_id) VALUES
    ('John', 'Smith', 'Allen', (SELECT id FROM specialization WHERE spec_name = 'Cardiologist')),
    ('Samantha', 'Brown', 'Marie', (SELECT id FROM specialization WHERE spec_name = 'Dentist')),
    ('Marcus', 'Wright', 'Lee', (SELECT id FROM specialization WHERE spec_name = 'Dermatologist'));

INSERT INTO visit_time (doctor_id, app_user_id, time_start, time_end) VALUES
    ((SELECT id FROM doctor WHERE last_name = 'Smith'), (SELECT id FROM app_user WHERE username = 'ann_d'), '2024-04-01 12:00:00', '2024-04-01 12:30:00'),
    ((SELECT id FROM doctor WHERE last_name = 'Brown'), (SELECT id FROM app_user WHERE username = 'alexander_b'), '2024-04-02 10:00:00', '2024-04-02 10:30:00');
