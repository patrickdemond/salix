DROP PROCEDURE IF EXISTS patch_apex_exam;
DELIMITER //
CREATE PROCEDURE patch_apex_exam()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "salix", "cenozo" ) );

    SELECT "Creating new apex_exam table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS apex_exam ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "apex_baseline_id INT UNSIGNED NOT NULL, ",
        "serial_number_id INT UNSIGNED NOT NULL, ",
        "barcode VARCHAR(10) NOT NULL, ",
        "rank INT UNSIGNED NOT NULL, ",
        "height FLOAT NULL DEFAULT NULL, ",
        "weight FLOAT NULL DEFAULT NULL, ",
        "age FLOAT NULL DEFAULT NULL, ",
        "technician VARCHAR(128) NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_apex_baseline_id (apex_baseline_id ASC), ",
        "INDEX fk_serial_number_id (serial_number_id ASC), ",
        "UNIQUE INDEX uq_serial_number_id_barcode (serial_number_id ASC, barcode ASC), ",
        "UNIQUE INDEX uq_apex_baseline_id_rank (apex_baseline_id ASC, rank ASC), ",
        "CONSTRAINT fk_apex_exam_apex_baseline_id ",
          "FOREIGN KEY (apex_baseline_id) ",
          "REFERENCES apex_baseline (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_apex_exam_serial_number_id ",
          "FOREIGN KEY (serial_number_id) ",
          "REFERENCES serial_number (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );

    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_apex_exam();
DROP PROCEDURE IF EXISTS patch_apex_exam;


DELIMITER $$

DROP TRIGGER IF EXISTS apex_exam_BEFORE_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER apex_exam_BEFORE_INSERT BEFORE INSERT ON apex_exam FOR EACH ROW
BEGIN
SET NEW.create_timestamp = NOW();
END$$

DROP TRIGGER IF EXISTS apex_exam_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER apex_exam_AFTER_INSERT AFTER INSERT ON apex_exam FOR EACH ROW
BEGIN
  CALL update_apex_baseline_first_apex_exam( NEW.apex_baseline_id );
END$$

DROP TRIGGER IF EXISTS apex_exam_AFTER_UPDATE $$
CREATE DEFINER = CURRENT_USER TRIGGER apex_exam_AFTER_UPDATE AFTER UPDATE ON apex_exam FOR EACH ROW
BEGIN
  CALL update_apex_baseline_first_apex_exam( NEW.apex_baseline_id );
END$$

DROP TRIGGER IF EXISTS apex_exam_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER apex_exam_AFTER_DELETE AFTER DELETE ON apex_exam FOR EACH ROW
BEGIN
  CALL update_apex_baseline_first_apex_exam( OLD.apex_baseline_id );
END$$

DELIMITER ;
