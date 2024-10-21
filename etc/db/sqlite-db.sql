DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS congregations;
DROP TABLE IF EXISTS publisher;
DROP TABLE IF EXISTS registry_periods;
DROP TABLE IF EXISTS territories;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS conductors;
DROP TABLE IF EXISTS meeting_places;
DROP TABLE IF EXISTS registries;
DROP TABLE IF EXISTS meeting_place_availability;
DROP TABLE IF EXISTS conductor_availability;
DROP TABLE IF EXISTS assignaments;

CREATE TABLE congregations
(
  number                INTEGER NOT NULL,
  name                  TEXT    NOT NULL,
  circuit               TEXT    NOT NULL,
  number_of_territories INTEGER NULL     DEFAULT 0,
  north_limit           TEXT    NOT NULL,
  south_limit           TEXT    NOT NULL,
  esast_limit           TEXT    NOT NULL,
  west_limit            TEXT    NOT NULL,
  map_image_url         TEXT    NULL    ,
  PRIMARY KEY (number)
);

CREATE TABLE registry_periods
(
  period_id   TEXT      NOT NULL,
  description TEXT(255) NOT NULL,
  start_date  NUMERIC   NOT NULL,
  end_date    NUMERIC   NULL    ,
  PRIMARY KEY (period_id)
);

CREATE TABLE programs
(
  program_id TEXT    NOT NULL,
  created_at NUMERIC NOT NULL,
  updated_at NUMERIC NULL    ,
  PRIMARY KEY (program_id)
);

CREATE TABLE roles
(
  id          TEXT NOT NULL,
  role        TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE publishers
(
  id        TEXT    NOT NULL,
  name      TEXT    NOT NULL,
  email     TEXT    NOT NULL,
  password  TEXT    NOT NULL,
  photo_url TEXT    NULL    ,
  enabled   NUMERIC NOT NULL DEFAULT 1,
  verified  NUMERIC NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE publisher__role
(
  publisher_id TEXT NOT NULL,
  role_id      TEXT NOT NULL,
  PRIMARY KEY (publisher_id, role_id),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id),
  FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE territories
(
  territory_id        TEXT      NOT NULL,
  congregation_number INTEGER   NOT NULL,
  number              INTEGER   NOT NULL,
  label               TEXT(200) NOT NULL,
  sector              TEXT      NOT NULL,
  quantity_house      INTEGER   NULL     DEFAULT 0,
  locality            TEXT      NOT NULL,
  locality_in_part    TEXT      NOT NULL,
  map_image_url       TEXT      NOT NULL,
  last_date_completed NUMERIC   NOT NULL,
  assigned_lock       NUMERIC   NOT NULL DEFAULT 0,
  PRIMARY KEY (territory_id),
  FOREIGN KEY (congregation_number) REFERENCES congregations (number)
);

CREATE TABLE conductors
(
  conductor_id TEXT     NOT NULL,
  publisher_id TEXT     NULL    ,
  -- Data encripted
  mobile_phone TEXT(12) NOT NULL,
  -- QUALIFIED_BROTHER, GROUP_SERVANT, GROUP_OVERSEER
  privilege    TEXT     NOT NULL,
  PRIMARY KEY (conductor_id),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE conductor_availability
(
  conductor_id TEXT NOT NULL,
  day          TEXT NOT NULL,
  moment       TEXT NOT NULL,
  PRIMARY KEY (conductor_id, day),
  FOREIGN KEY (conductor_id) REFERENCES conductors (conductor_id)
);

CREATE TABLE meeting_places
(
  meeting_place_id TEXT      NOT NULL,
  publisher_id     TEXT      NULL    ,
  territory_id     TEXT      NOT NULL,
  place            TEXT(200) NOT NULL,
  mobile_phone     TEXT(11)  NULL    ,
  latitude         TEXT      NULL    ,
  longitude        TEXT      NULL    ,
  field_service    NUMERIC   NOT NULL DEFAULT 0,
  PRIMARY KEY (meeting_place_id),
  FOREIGN KEY (territory_id) REFERENCES territories (territory_id),
  FOREIGN KEY (publisher_id) REFERENCES publishers (id)
);

CREATE TABLE meeting_place_availability
(
  meeting_place_id TEXT NOT NULL,
  day              TEXT NOT NULL,
  moment           TEXT NOT NULL,
  PRIMARY KEY (meeting_place_id, day),
  FOREIGN KEY (meeting_place_id) REFERENCES meeting_places (meeting_place_id)
);

CREATE TABLE assignaments
(
  assignament_id   TEXT    NOT NULL,
  id_meeting_place TEXT    NOT NULL,
  conductor_id     TEXT    NOT NULL,
  program_id       TEXT    NOT NULL,
  date             NUMERIC NOT NULL,
  PRIMARY KEY (assignament_id),
  FOREIGN KEY (program_id) REFERENCES programs (program_id),
  FOREIGN KEY (id_meeting_place) REFERENCES meeting_places (meeting_place_id),
  FOREIGN KEY (conductor_id) REFERENCES conductors (conductor_id)
);

CREATE TABLE registries
(
  registry_id    TEXT    NOT NULL,
  date_assigned  NUMERIC NOT NULL,
  date_completed NUMERIC NULL    ,
  assigned_to    TEXT    NOT NULL,
  territory_id   TEXT    NULL    ,
  period_id      TEXT    NOT NULL,
  PRIMARY KEY (registry_id),
  FOREIGN KEY (territory_id) REFERENCES territories (territory_id),
  FOREIGN KEY (assigned_to) REFERENCES conductors (conductor_id),
  FOREIGN KEY (period_id) REFERENCES registry_periods (period_id)
);
