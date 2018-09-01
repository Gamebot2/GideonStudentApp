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

-- table view
SELECT * FROM books;
SELECT * FROM records;
SELECT * from students;

-- put whatever here

INSERT INTO students (Client, FirstName, LastName, Grade, Gender)
VALUES ("Test Student", "Test", "Student", "5th", "Male");













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
	WHERE records.StudentId = 3;
    
-- all unfinished records
SELECT *
FROM records
WHERE records.EndDate IS NULL;

-- all categories in which a certain student has records
SELECT DISTINCT book.Category
FROM records
INNER JOIN students
	ON records.StudentId = students.StudentId
INNER JOIN books
	ON records.BookId = books.BookId
WHERE
    students.StudentId = 3;