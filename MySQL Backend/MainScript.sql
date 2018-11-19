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
SELECT * FROM books_sequences;
SELECT * FROM students_s;
SELECT * FROM students_withdata;
SELECT * FROM records_joined;
SELECT * FROM internationaldata_joined;

-- procedure calls
CALL `grade_increment`();
CALL `grade_decrement`();


-- put whatever here
ALTER TABLE students ADD COLUMN LastUsed DATETIME DEFAULT '2000-01-01';

SELECT StudentId, Grade FROM students;








-- delete a student while maintaining referential integrity in records
DELETE FROM records WHERE RecordId > 0 AND StudentId = 69;
DELETE FROM students WHERE StudentId = 69;


-- all books in a category
SELECT *
FROM books
WHERE Category = 'Comprehension';


-- all records belonging to a student
SELECT * FROM records_joined
	WHERE StudentId = 66;
        
        
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
SELECT DISTINCT Category
FROM records_joined
WHERE StudentId = 66;


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