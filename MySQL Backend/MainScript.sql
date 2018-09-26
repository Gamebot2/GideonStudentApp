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

-- table view
SELECT * FROM books;
SELECT * FROM records;
SELECT * FROM students;
SELECT * FROM internationaldata;

-- put whatever here

INSERT INTO internationaldata (Category, Month, BookId) VALUES ("Calculation", 7*12, 79);

ALTER TABLE books ADD COLUMN Abbreviation VARCHAR(255) DEFAULT NULL;
UPDATE books SET Abbreviation = Title WHERE BookId >= 0;








-- delete a student while maintaining referential integrity in records
DELETE FROM records WHERE RecordId > 0 AND StudentID IN (SELECT StudentId FROM students WHERE StudentId = 69);
DELETE FROM students WHERE StudentId = 69;

-- selecting records with way more detail (customize the WHERE clause to filter)
SELECT *
FROM records
INNER JOIN books
	ON records.BookId = books.BookId
INNER JOIN students
	ON records.StudentId = students.StudentId;

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
    
-- select international data with relevant book data attached
SELECT
	i.DataId, i.Category, i.Month, i.BookId, b.SequenceLarge
FROM internationaldata i
JOIN books b
	ON i.BookId = b.BookId
WHERE i.Category = "Calculation"
ORDER BY i.Month;