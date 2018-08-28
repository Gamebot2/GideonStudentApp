/*
							GRADE INCREMENTOR

Bumps up the grade of every student in the database, meant to be used once a year
*/

-- target the database
USE gideon;

-- when testing, change this value to any id number representing a test student in the database
SET @testId := 77;

-- makes a temporary table to map strings and numbers representing grade levels
CREATE TABLE `grades` (
	`GradeId` int(11) NOT NULL AUTO_INCREMENT,
    `GradeNumber` int(11) DEFAULT NULL,
    `GradeString` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`GradeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- manually inserts the 14 values for the table
INSERT INTO grades (GradeNumber, GradeString)
VALUES
	(-1, 'PreK (-1)'),
	(0, 'Kinder (0)'),
    (1, '1st'),
    (2, '2nd'),
    (3, '3rd'),
    (4, '4th'),
    (5, '5th'),
    (6, '6th'),
    (7, '7th'),
    (8, '8th'),
    (9, '9th'),
    (10, '10th'),
    (11, '11th'),
    (12, '12th');

-- increments the grade level for all students, with checks to make sure that grades above 12, below -1, and undefined are accounted for
UPDATE students
SET Grade = CASE
	WHEN students.Grade = null OR students.Grade = ""
    THEN ""
	/*WHEN students.Grade = "PreK (-1)" 	-- uncomment if decrementing grades
    THEN "PreK (-1)"*/
	WHEN
		students.Grade IN (
			SELECT
				grades.GradeString
			FROM grades
		)
		&& NOT students.Grade = "12th"
	THEN (
		SELECT
			grades.GradeString
		FROM grades
		WHERE grades.GradeNumber = (
			SELECT
				grades.GradeNumber + 1 		-- if you need to decrement everyone's grade, change this to grades.GradeNumber - 1, and uncomment the above WHEN clause
			FROM grades
			WHERE grades.GradeString = students.Grade
		)
	)
	ELSE
		CONCAT(CAST(CAST(SUBSTRING(students.Grade, 1, 2) AS SIGNED) + 1 AS CHAR), "th")
END
WHERE StudentId >= 0; -- replace this line with "WHERE StudentId = @testId" when testing

-- debug clauses, for use in testing
/*
SELECT * FROM grades;
SELECT StudentId, Client, Grade FROM students;
SELECT StudentId, Client, Grade FROM students WHERE StudentId = @testId;
UPDATE students SET Grade = "1st" WHERE StudentID = @testId;
SELECT StudentId, Client, CAST(CAST(SUBSTRING(students.Grade, 1, 2) AS SIGNED) + 1 AS CHAR) AS castcheck FROM students;
*/

-- finally, remove the table
DROP TABLE grades;