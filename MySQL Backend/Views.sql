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
        b.Title,records_joined
        b.SequenceLarge
    FROM records r
	JOIN students s ON r.StudentId = s.StudentId
	JOIN books b ON r.BookId = b.BookId
	ORDER BY r.StartDate DESC;