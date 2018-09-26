/*
											SEQUENCE LENGTH

This file will temporarily exist for several commits. It generates a sequenceLength column in the books table.
*/

-- target the database
USE gideon;

-- Create the new column that the data will get dumped into
ALTER TABLE books
	ADD COLUMN SequenceLength INT(11) NOT NULL DEFAULT 1;

-- Backup the current abbreviations column, in case this whole thing doesn't work out (computer #2 did not have these to begin with so no backup table is necessary)
CREATE TABLE `backup` (
		`Id` INT(11) NOT NULL AUTO_INCREMENT,
		`BookId` INT(11) NOT NULL,
		`Abbreviation` VARCHAR(255) NOT NULL,
		PRIMARY KEY (`Id`)
	)	ENGINE=INNODB AUTO_INCREMENT=66 DEFAULT CHARSET=UTF8;
INSERT INTO backup (BookId, Abbreviation)
	SELECT BookId, Abbreviation
    FROM books;
SELECT * FROM backup;

-- Repurpose the abbrevation column for the sequence name
ALTER TABLE books
	CHANGE COLUMN Abbreviation SequenceName VARCHAR(255) NULL DEFAULT NULL;
UPDATE books
	SET SequenceName = CASE
		WHEN BookId < 376 THEN Subcategory
        ELSE CONCAT(Category, " ", GradeLevel) END
	WHERE
		BookId >= 0;
SELECT * FROM books;

-- The real-deal scripting part: loading sequenceLength with the right values  
UPDATE books b
	SET b.SequenceLength = (
		SELECT Length FROM (
			SELECT
				SequenceName Name,
				COUNT(*) Length
			FROM books
				GROUP BY 1
				ORDER BY BookId) s
        WHERE b.SequenceName = s.Name
    )
    WHERE b.BookId >= 0;
SELECT * FROM books;

-- Run this once you're sure that absolutely everything works!
DROP TABLE backup;

/* Do not run this - sequenceLength is definitely meant to be permanent - this is only for testing, or if it doesn't work out */
ALTER TABLE books
	DROP COLUMN sequenceLength;