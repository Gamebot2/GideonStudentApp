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
        s.Client,
        b.Category,
        b.Subcategory,
        b.Title,
        b.SequenceLarge
    FROM records r
	JOIN students s ON r.StudentId = s.StudentId
	JOIN books b ON r.BookId = b.BookId
	ORDER BY r.StartDate DESC;

CREATE VIEW `students_withdata` AS
	SELECT
		*
	FROM students s
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