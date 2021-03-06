SELECT "Creating new code_type table" AS "";

CREATE TABLE IF NOT EXISTS code_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  create_timestamp TIMESTAMP NOT NULL,
  code VARCHAR(45) NOT NULL,
  description TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_code (code ASC))
ENGINE = InnoDB;


DELIMITER $$

DROP TRIGGER IF EXISTS code_type_BEFORE_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER code_type_BEFORE_INSERT BEFORE INSERT ON code_type FOR EACH ROW
BEGIN
SET NEW.create_timestamp = NOW();
END$$

DELIMITER ;

INSERT IGNORE INTO code_type ( code, description ) VALUES
( 'Ab', 'The femur is abducted.' ),
( 'Ad', 'The femur is adducted.' ),
( 'Erot', 'The femur is externally rotated.' ),
( 'Irot', 'The femur is internally rotated.' ),
( 'high', 'The ROI is placed too high and/or clipping of lower anatomy.' ),
( 'low', 'The ROI is placed too low and/or clipping of upper anatomy.' ),
( 'left', 'The anatomy is placed too far to the left in the ROI.' ),
( 'right', 'The ROI is placed too far left and/or clipping of the anatomy along the right side of the ROI.' ),
( 'art(metal)', 'Metal artifact.' ),
( 'art(blur)', 'Blurring artifact.' ),
( 'art(streak)', 'Streak or banding artifact.' ),
( 'art(unknown)', 'Unknown artifact.' ),
( 'art(object)', 'Object artifact.' ),
( 'art(motion)', 'Motion artifact.' ),
( 'art(noise)', 'Noise or poor quality (grainy) image.' ),
( 'other', 'Corrupt file or other condition.' ),
( 'lines(pelvis)', 'The pelvis is improperly framed.' ),
( 'lines(legs)', 'The legs are improperly framed.' ),
( 'lines(neck)', 'Neck line is improperly placed.' ),
( 'lines(arms)', 'The arm line(s) are improperly placed through the glenoid fossa.' ),
( 'lines(spine)', 'The spine is improperly framed and/or incorrect division between T12 and L1.' ),
( 'separation', 'Insufficient separation or overlap of anatomy.' );
