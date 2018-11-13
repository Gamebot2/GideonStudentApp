/*
							MAIN SCRIPT

Mostly miscellaneous queries meant to be edited and used one at a time
*/

-- database overview
SHOW DATABASES;
USE gideon;
SHOW TABLES;

-- table overview
DESCRIBE books;
DESCRIBE records;
DESCRIBE students;
DESCRIBE internationaldata;

-- table select
SELECT * FROM books;
SELECT * FROM records;
SELECT * FROM students;
SELECT * FROM internationaldata;

-- view select
SELECT * FROM records_joined;

-- put whatever here
ALTER TABLE students ADD COLUMN LastUsed DATETIME DEFAULT '2000-01-01';

SELECT Grade FROM students WHERE StudentId = 3 LIMIT 1;








-- delete a student while maintaining referential integrity in records
DELETE FROM records WHERE RecordId > 0 AND StudentId = 69;
DELETE FROM students WHERE StudentId = 69;

-- selects students with records
SELECT DISTINCT
    students.StudentId,
    students.Client,
    students.Email,
    students.ClientId,
    students.CurrentPasses,
    students.FirstName,
    students.Gender,
    students.Grade,
    students.LastName,
    students.MiddleName,
    students.PrimaryStaffMember
FROM students
RIGHT JOIN records
	ON records.StudentId = students.StudentId;

-- all books in a category
SELECT DISTINCT
    Subcategory,
    BookId,
    Subject,
    Category,
    Title,
    GradeLevel,
    Test,
    TimeAllowed,
    MistakesAllowed,
    Sequence,
    SequenceLarge
FROM books
WHERE Category = 'Comprehension';

-- total number of books in a sequence
SELECT
	CASE
		WHEN BookId < 376 THEN Subcategory
        ELSE CONCAT(Category, " ", GradeLevel)
    END AS sequenceName,
    COUNT(*) AS sequenceLength
FROM books
GROUP BY 1
ORDER BY BookId;

-- all records belonging to a student
SELECT 
    records.RecordId,
    records.StudentId,
    records.BookId,
    records.StartDate,
    records.EndDate,
    records.Rep,
    records.Test,
    records.TestTime,
    records.Mistakes,
    students.Client
FROM records
INNER JOIN students
	ON records.StudentId = students.StudentId
	WHERE records.StudentId = 78;
        
        
-- all records belonging to a student within a time period, with one record outside each boundary if possible (very repetitive, therefore unused)
(SELECT * FROM records r JOIN books b ON r.BookId = b.BookId JOIN students s ON r.StudentId = s.StudentId WHERE
		r.StudentId = 3 AND
        r.Rep = 1 AND
        b.Category = "Comprehension" AND
		r.StartDate < '2017-06-01 00:00:00'
	ORDER BY r.StartDate DESC
	LIMIT 1)
UNION
(SELECT * FROM records r JOIN books b ON r.BookId = b.BookId JOIN students s ON r.StudentId = s.StudentId WHERE
		r.StudentId = 3 AND
        r.Rep = 1 AND
        b.Category = "Comprehension" AND
		r.StartDate >= '2017-06-01 00:00:00' AND StartDate <= '2018-06-01 00:00:00'
	ORDER BY r.StartDate ASC
    LIMIT 1000)
UNION
(SELECT * FROM records r JOIN books b ON r.BookId = b.BookId JOIN students s ON r.StudentId = s.StudentId WHERE
		r.StudentId = 3 AND
        r.Rep = 1 AND
        b.Category = "Comprehension" AND
		r.StartDate > '2018-06-01 00:00:00'
	ORDER BY r.StartDate ASC
	LIMIT 1)
;
    
-- all unfinished records
SELECT *
FROM records
WHERE records.EndDate IS NULL;

-- all categories in which a certain student has records
SELECT DISTINCT books.Category
FROM records
INNER JOIN students
	ON records.StudentId = students.StudentId
INNER JOIN books
	ON records.BookId = books.BookId
WHERE
    students.StudentId = 77;
    
-- reset the LastUsed column
UPDATE students s
SET LastUsed = CASE
	WHEN (
		SELECT r.StartDate
		FROM records r
		WHERE r.StudentId = s.StudentId
		ORDER BY r.StartDate DESC
		LIMIT 1
	) IS NULL THEN '2000-01-01'
    ELSE (
		SELECT r.StartDate
		FROM records r
		WHERE r.StudentId = s.StudentId
		ORDER BY r.StartDate DESC
		LIMIT 1
	) END
WHERE StudentId >= 0;
    
-- select international data with relevant book data attached
SELECT
	i.DataId, i.Category, i.BookId, i.Grade, b.SequenceLarge
FROM internationaldata i
JOIN books b
	ON i.BookId = b.BookId
WHERE i.Category = "Calculation"
ORDER BY b.SequenceLarge;