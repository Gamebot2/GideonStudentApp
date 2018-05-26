SHOW databases;
use gideon;
show tables;
SELECT * FROM book;
SELECT * FROM records;
SELECT * from students;
SELECT DISTINCT students.StudentId, students.Client, students.Email, students.ClientId, students.CurrentPasses, students.FirstName,
students.Gender, students.Grade, students.LastName, students.MiddleName, students.PrimaryStaffMember
FROM students RIGHT JOIN records ON records.StudentId = students.StudentId;
DESCRIBE students;

SELECT DISTINCT subcategory, book_id, subject, category, title, gradeLevel, test, timeAllowed, mistakesAllowed, sequence, sequenceLarge FROM book WHERE category = 'Comprehension';

SELECT * FROM students WHERE StudentId = "3";

DROP TABLE book;
DROP TABLE records;
DROP TABLE newrecordsheet;
SELECT records.RecordId, records.StudentId, records.BookId, records.StartDate, records.EndDate, records.Rep, records.Test, records.TestTime, records.Mistakes, students.Client FROM records
INNER JOIN students ON records.StudentId = students.StudentId WHERE records.StudentId = 3 ;

SELECT * FROM records;
DELETE FROM records WHERE RecordId = 277;
SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId WHERE records.StudentId = 3 AND book.category = 'Grammar';

SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId WHERE records.EndDate IS NULL;


INSERT INTO records (StudentId, BookId, StartDate, EndDate, Rep, Test, TestTime, Mistakes) 
VALUES (10000, 10000, null, null, 1, 1, null, null);

SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId;

SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId WHERE records.StudentId = 3 AND book.category = "Grammar" AND records.Rep = 1 AND book.subcategory = "Grammar 1";

SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId WHERE records.StudentId = 3;

SELECT DISTINCT book.category FROM records INNER JOIN students ON records.StudentId = students.StudentId INNER JOIN book ON records.BookId = book.book_id WHERE students.StudentId = 3;