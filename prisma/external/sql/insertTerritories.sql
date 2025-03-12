-- @params {String} $1:id
-- @params {Int} $2:congregationId
-- @params {Int} $3:number
-- @params {String} $4:label
-- @params {String} $5:sector
-- @params {Int} $6:quantityHouses
-- @params {String} $7:lacality
-- @params {String} $8:localityInPart
-- @params {DateTime} $9:lastDateCompledted
-- @params {Boolean} $10:currentAssigned
INSERT INTO territories (territory_id, congregation_id, number, label, sector, quantity_houses, locality, locality_in_part, last_date_completed, current_assigned)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)