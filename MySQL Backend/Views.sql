CREATE VIEW `records_joined` AS
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
    FROM records r
	JOIN students s ON r.StudentId = s.StudentId
	JOIN books b ON r.BookId = b.BookId
	ORDER BY r.StartDate DESC;

CREATE VIEW `students_s` AS
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
	FROM students s;

CREATE VIEW `students_withdata` AS
	SELECT
		*
	FROM students_s s
    WHERE s.StudentId IN (
		SELECT DISTINCT
			StudentId
		FROM records r
    );
    
CREATE VIEW `internationaldata_joined` AS
	SELECT
		i.DataId,
        i.Category, 
        i.BookId,
        i.Grade,
        b.SequenceLarge
	FROM internationaldata i
	JOIN books b ON i.BookId = b.BookId
	ORDER BY b.SequenceLarge;
    
CREATE VIEW `books_sequences` AS
	SELECT
		CASE
			WHEN BookId < 376 THEN Subcategory
			ELSE CONCAT(Category, " ", GradeLevel)
		END AS sequenceName,
		COUNT(*) AS sequenceLength
	FROM books
	GROUP BY 1
	ORDER BY BookId;





DELIMITER //
CREATE PROCEDURE `delete_student` (IN Id INT(11))
BEGIN
	DELETE FROM records WHERE RecordId > 0 AND StudentId = Id;
	DELETE FROM students WHERE StudentId = Id;
END //
DELIMITER ;