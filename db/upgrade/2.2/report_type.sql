DROP PROCEDURE IF EXISTS patch_report_type;
  DELIMITER //
  CREATE PROCEDURE patch_report_type()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id" );

    SELECT "Adding records to report_type table" AS "";

    SET @sql = CONCAT(
      "INSERT IGNORE INTO ", @cenozo, ".report_type ",
      "SET name = 'status', ",
        "title = 'Status', ",
        "subject = 'apex_deployment', ",
        "description = 'Reports on the status of apex deployments.'" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
  END //
DELIMITER ;

-- now call the procedure and remove the procedure
CALL patch_report_type();
DROP PROCEDURE IF EXISTS patch_report_type;
