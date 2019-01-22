CREATE VIEW `demorecords_joined` AS
	SELECT 
		r.RecordId,
        r.StudentId,
        r.BookId,
        r.StartDate,
        r.EndDate,
        r.Rep,
        r.Test,
        r.TestTime,
        r.Mistakes,
        r.Notes,
        s.Client,
        b.Category,
        b.Subcategory,
        b.Title,
        b.SequenceLarge
    FROM demorecords r
	JOIN demostudents s ON r.StudentId = s.StudentId
	JOIN demobooks b ON r.BookId = b.BookId
	ORDER BY r.StartDate DESC;

CREATE VIEW `demostudents_s` AS
	SELECT
		s.StudentId,
        s.Client,
        s.Email,
        s.Phone,
        s.Address,
        s.CurrentPasses,
        s.FirstName,
        s.LastName,
        s.Grade,
        s.Gender,
        s.LastUsed
	FROM demostudents s;

CREATE VIEW `demostudents_withdata` AS
	SELECT
		*
	FROM demostudents_s s
    WHERE s.StudentId IN (
		SELECT DISTINCT
			StudentId
		FROM demorecords r
    );
    
CREATE VIEW `demointernationaldata_joined` AS
	SELECT
		i.DataId,
        i.Category, 
        i.BookId,
        i.Grade,
        b.SequenceLarge
	FROM demointernationaldata i
	JOIN demobooks b ON i.BookId = b.BookId
	ORDER BY b.SequenceLarge;
    
CREATE VIEW `demobooks_sequences` AS
	SELECT
		CASE
			WHEN BookId < 376 THEN Subcategory
			ELSE CONCAT(Category, " ", GradeLevel)
		END AS sequenceName,
		COUNT(*) AS sequenceLength
	FROM demobooks
	GROUP BY 1
	ORDER BY BookId;





DELIMITER //
CREATE PROCEDURE `delete_student` (IN Id INT(11))
BEGIN
	DELETE FROM records WHERE RecordId > 0 AND StudentId = Id;
	DELETE FROM students WHERE StudentId = Id;
END //
DELIMITER ;