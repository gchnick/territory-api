DROP TABLE IF EXISTS months_years_service;
DROP TABLE IF EXISTS phones;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS family_groups;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS emergency_contacts;
DROP TABLE IF EXISTS elders;
DROP TABLE IF EXISTS ministerial_servants;
DROP TABLE IF EXISTS pionners;
DROP TABLE IF EXISTS publisher__phone;
DROP TABLE IF EXISTS publisher__role;
DROP TABLE IF EXISTS current_file;
DROP TABLE IF EXISTS dead_file;
DROP TABLE IF EXISTS total_auxiliary_pioneers_reports;
DROP TABLE IF EXISTS total_pioneers_reports;
DROP TABLE IF EXISTS total_publishers_reports;

CREATE TABLE months_years_service
(
  id   TEXT    NOT NULL,
  date NUMERIC NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE phones
(
  id     INTEGER   NOT NULL,
  label  TEXT(200) NOT NULL,
  number TEXT(7)   NOT NULL UNIQUE,
  PRIMARY KEY (id AUTOINCREMENT)
);

CREATE TABLE roles
(
  id          INTEGER   NOT NULL,
  -- GROUP_OVERSEER, GROUP_SERVANT, GROUP_ASSISTANT
  role        TEXT(10)  NOT NULL UNIQUE,
  description TEXT(200) NULL    ,
  PRIMARY KEY (id AUTOINCREMENT)
);

CREATE TABLE family_groups
(
  id    INTEGER   NOT NULL,
  label TEXT(200) NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT)
);

CREATE TABLE publishers
(
  id              TEXT      NOT NULL,
  family_group_id INTEGER   NULL    ,
  householder     NUMERIC   NOT NULL DEFAULT 0,
  sort_name       TEXT      NOT NULL UNIQUE,
  full_name       TEXT      NULL    ,
  address         TEXT      NULL    ,
  mobile_phone    TEXT      NULL    ,
  service_group   INTEGER   NOT NULL,
  photo_url       TEXT(255) NULL    ,
  -- ELDER,  MINISTERIAL_SERVANT, PIONEER, MISSIONARY
  privilege       TEXT      NOT NULL,
  -- OTHER_SHEEP,  ANOINTED
  hope            TEXT      NULL    ,
  last_reporter   NUMERIC   NULL    ,
  is_active       NUMERIC   NOT NULL DEFAULT 1,
  is_aparted      NUMERIC   NOT NULL DEFAULT 0,
  email           TEXT      NULL     UNIQUE,
  password        TEXT      NULL    ,
  enabled         NUMERIC   NOT NULL DEFAULT 1,
  verified        NUMERIC   NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (family_group_id) REFERENCES family_groups (id)
);

CREATE TABLE emergency_contacts
(
  id           INTEGER   NOT NULL,
  publisher_id TEXT      NOT NULL UNIQUE,
  full_name    TEXT(200) NOT NULL,
  phone        TEXT(7)   NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE elders
(
  id           INTEGER NOT NULL,
  publisher_id TEXT    NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE ministerial_servants
(
  id           INTEGER NOT NULL,
  publisher_id TEXT    NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE missionaries
(
  id           INTEGER NOT NULL,
  publisher_id TEXT    NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE pionners
(
  id           INTEGER NOT NULL,
  publisher_id TEXT    NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE publisher__phone
(
  publisher_id TEXT    NOT NULL,
  phone_id     INTEGER NOT NULL,
  PRIMARY KEY (publisher_id, phone_id),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id),
  FOREIGN KEY (phone_id) REFERENCES phones (id)
);

CREATE TABLE publisher__role
(
  role_id      INTEGER NOT NULL,
  publisher_id TEXT    NOT NULL,
  PRIMARY KEY (role_id, publisher_id),
  FOREIGN KEY (role_id) REFERENCES roles (id),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

-- Reports for the current year of service
CREATE TABLE current_file
(
  id                         INTEGER   NOT NULL,
  publisher_id               TEXT      NOT NULL,
  month_id                   TEXT      NOT NULL,
  participated_in_some_facet NUMERIC   NOT NULL DEFAULT 0,
  hours                      REAL      NULL    ,
  bible_courses              INTEGER   NULL    ,
  is_pioneer                 NUMERIC   NULL    ,
  is_auxiliary_pioneer       NUMERIC   NULL    ,
  comment                    TEXT(255) NULL    ,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id),
  FOREIGN KEY (month_id) REFERENCES months_years_service (id)
);

-- Reports for the last seven years
CREATE TABLE dead_file
(
  id                         INTEGER   NOT NULL,
  month_id                   TEXT      NOT NULL,
  publisher_id               TEXT      NOT NULL,
  participated_in_some_facet NUMERIC   NOT NULL DEFAULT 0,
  hours                      REAL      NULL    ,
  bible_courses              INTEGER   NULL    ,
  is_pioneer                 NUMERIC   NULL    ,
  is_auxiliary_pioneer       NUMERIC   NULL    ,
  comment                    TEXT(255) NULL    ,
  PRIMARY KEY (id),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id),
  FOREIGN KEY (month_id) REFERENCES months_years_service (id)
);

CREATE TABLE total_auxiliary_pioneers_reports
(
  id                       INTEGER NOT NULL,
  month_id                 TEXT    NOT NULL,
  hours                    REAL    NULL    ,
  bible_courses            INTEGER NULL    ,
  total_reports            INTEGER NOT NULL,
  total_auxiliary_pioneers INTEGER NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (month_id) REFERENCES months_years_service (id)
);

CREATE TABLE total_pioneers_reports
(
  id             INTEGER NOT NULL,
  month_id       TEXT    NOT NULL,
  bible_courses  INTEGER NULL    ,
  total_reports  INTEGER NOT NULL,
  total_pioneers INTEGER NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (month_id) REFERENCES months_years_service (id)
);

CREATE TABLE total_publishers_reports
(
  id               INTEGER NOT NULL,
  bible_courses    INTEGER NULL    ,
  total_reports    INTEGER NOT NULL,
  total_publishers INTEGER NOT NULL,
  month_id         TEXT    NOT NULL,
  PRIMARY KEY (id AUTOINCREMENT),
  FOREIGN KEY (month_id) REFERENCES months_years_service (id)
);