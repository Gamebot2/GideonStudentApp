-- create database
CREATE DATABASE `gideon` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE gideon;

-- books
CREATE TABLE `demobooks` (
	`BookId` INT(11) NOT NULL,
	`Subject` VARCHAR(25) DEFAULT NULL,
	`Category` VARCHAR(255) DEFAULT NULL,
	`Subcategory` VARCHAR(255) DEFAULT NULL,
	`Title` VARCHAR(255) DEFAULT NULL,
    `SequenceName` VARCHAR(255) DEFAULT NULL,
	`GradeLevel` VARCHAR(255) DEFAULT NULL,
	`Test` INT(11) NOT NULL,
	`TimeAllowed` INT(11) NOT NULL,
	`MistakesAllowed` INT(11) NOT NULL,
	`Sequence` INT(11) NOT NULL,
	`SequenceLarge` INT(11) NOT NULL,
    `SequenceLength` INT(11) DEFAULT 1 NOT NULL,
	PRIMARY KEY (`BookId`),
	KEY `Test_index` (`Test`),
	KEY `TimeAllowed_index` (`TimeAllowed`),
	KEY `MistakesAllowed_index` (`MistakesAllowed`),
	KEY `Sequence_index` (`Sequence`),
	KEY `SequenceLarge_index` (`SequenceLarge`)
)	ENGINE=INNODB DEFAULT CHARSET=UTF8;

-- students
CREATE TABLE `demostudents` (
	`StudentId` INT(11) NOT NULL AUTO_INCREMENT,
	`Client` VARCHAR(45) DEFAULT NULL,
	`Email` VARCHAR(255) DEFAULT NULL,
	`Phone` VARCHAR(45) DEFAULT NULL,
	`Address` VARCHAR(255) DEFAULT NULL,
	`Tenure` INT(11) NOT NULL DEFAULT 0,
	`PlanOnHold` TINYINT(1) DEFAULT NULL,
	`PaymentOnFile` TINYINT(1) DEFAULT NULL,
	`LastMembershipEndDate` VARCHAR(255) DEFAULT NULL,
	`NextPass` VARCHAR(255) DEFAULT NULL,
	`CurrentPasses` VARCHAR(255) DEFAULT NULL,
	`PrimaryStaffMember` VARCHAR(45) DEFAULT NULL,
	`FirstName` VARCHAR(25) DEFAULT NULL,
	`MiddleName` VARCHAR(25) DEFAULT NULL,
	`LastName` VARCHAR(25) DEFAULT NULL,
	`Grade` VARCHAR(12) DEFAULT NULL,
	`Gender` VARCHAR(12) DEFAULT NULL,
	`ClientId` INT(11) NOT NULL DEFAULT 0,
	`LastUsed` DATETIME NOT NULL DEFAULT '0000-00-00',
	PRIMARY KEY (`StudentId`),
	KEY `Tenure_index` (`Tenure`),
	KEY `ClientId_index` (`ClientId`)
)	ENGINE=INNODB AUTO_INCREMENT=66 DEFAULT CHARSET=UTF8;

-- records
CREATE TABLE `demorecords` (
	`RecordId` INT(11) NOT NULL AUTO_INCREMENT,
	`StudentId` INT(11) NOT NULL,
	`BookId` INT(11) NOT NULL,
	`StartDate` DATETIME DEFAULT NULL,
	`EndDate` DATETIME DEFAULT NULL,
	`Rep` INT(11) NOT NULL DEFAULT 1,
	`Test` INT(11) NOT NULL DEFAULT 0,
	`TestTime` VARCHAR(255) DEFAULT NULL,
	`Mistakes` VARCHAR(255) DEFAULT NULL,
    `Notes` VARCHAR(1023) DEFAULT NULL,
	PRIMARY KEY (`RecordId`),
	CONSTRAINT FOREIGN KEY (`StudentId`) REFERENCES `demostudents`(`StudentId`),
	CONSTRAINT FOREIGN KEY (`BookId`) REFERENCES `demobooks`(`BookId`),
	KEY `StudentId_index` (`StudentId`),
	KEY `BookId_index` (`BookId`),
	KEY `Rep_index` (`Rep`),
	KEY `Test_index` (`Test`)
)	ENGINE=INNODB AUTO_INCREMENT=276 DEFAULT CHARSET=UTF8;

-- international data
CREATE TABLE `demointernationaldata` (
	`DataId` INT(11) NOT NULL AUTO_INCREMENT,
    `Category` VARCHAR(255) NOT NULL,
    `BookId` INT(11) NOT NULL,
    `Grade` VARCHAR(12) NOT NULL,
    PRIMARY KEY (`DataId`),
    CONSTRAINT FOREIGN KEY (`BookId`) REFERENCES `demobooks`(`BookId`)
)	ENGINE=INNODB AUTO_INCREMENT=66 DEFAULT CHARSET=UTF8;




-- DEMO MODE TEST DATA
INSERT INTO `demobooks`
	(`BookId`, `Subject`, `Category`, `Subcategory`, `SequenceName`, `Title`, `GradeLevel`, `Test`, `TimeAllowed`, `MistakesAllowed`, `Sequence`, `SequenceLarge`, `SequenceLength`)
VALUES 
	('1',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Simple Addition',    		'1', '1', '10', '4', '1', '1',  '8'),
	('2',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Simple Subtraction', 		'1', '1', '10', '4', '2', '2',  '8'),
	('3',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Complex Addition',   		'2', '1', '10', '4', '3', '3',  '8'),
	('4',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Complex Subtraction', 		'2', '1', '10', '4', '4', '4',  '8'),
	('5',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Simple Multiplication', 	'3', '1', '10', '4', '5', '5',  '8'),
	('6',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Simple Division', 			'3', '1', '10', '4', '6', '6',  '8'),
	('7',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Complex Multiplication', 	'4', '1', '10', '4', '7', '7',  '8'),
	('8',  'Math', 'Calculation', 'Arithmetic',  'Arith',   'Complex Division', 		'4', '1', '10', '4', '8', '8',  '8'),
	('9',  'Math', 'Calculation', 'Pre-Algebra', 'Pre-Alg', 'Negative Number', 			'5', '1', '12', '5', '1', '9',  '6'),
	('10', 'Math', 'Calculation', 'Pre-Algebra', 'Pre-Alg', 'Fractions', 				'5', '1', '12', '5', '2', '10', '6'),
	('11', 'Math', 'Calculation', 'Pre-Algebra', 'Pre-Alg', 'Decimals', 				'5', '1', '12', '5', '3', '11', '6'),
	('12', 'Math', 'Calculation', 'Pre-Algebra', 'Pre-Alg', 'Exponents', 				'5', '1', '12', '5', '4', '12', '6'),
	('13', 'Math', 'Calculation', 'Pre-Algebra', 'Pre-Alg', 'Logarithms', 				'5', '1', '12', '5', '5', '13', '6'),
	('14', 'Math', 'Calculation', 'Pre-Algebra', 'Pre-Alg', 'Transcendental Numbers', 	'5', '1', '12', '5', '6', '14', '6'),
	('15', 'Math', 'Calculation', 'Algebra',     'Alg',     'Basic Equations', 			'6', '1', '15', '3', '1', '15', '9'),
	('16', 'Math', 'Calculation', 'Algebra',     'Alg',     'Complex Equations', 		'6', '1', '15', '3', '2', '16', '9'),
	('17', 'Math', 'Calculation', 'Algebra',     'Alg',     'Basic Inequalities', 		'6', '1', '15', '3', '3', '17', '9'),
	('18', 'Math', 'Calculation', 'Algebra',     'Alg',     'Complex Inequalities', 	'6', '1', '15', '3', '4', '18', '9'),
	('19', 'Math', 'Calculation', 'Algebra',     'Alg',     'Graphing Lines', 			'7', '1', '15', '3', '5', '19', '9'),
	('20', 'Math', 'Calculation', 'Algebra',     'Alg',     'Factoring', 				'7', '1', '15', '3', '6', '20', '9'),
	('21', 'Math', 'Calculation', 'Algebra',     'Alg',     'Solving Quadratics', 		'7', '1', '15', '3', '7', '21', '9'),
	('22', 'Math', 'Calculation', 'Algebra',     'Alg',     'Graphing Quadratics', 		'7', '1', '15', '3', '8', '22', '9'),
	('23', 'Math', 'Calculation', 'Algebra',     'Alg',     'Systems of Equations', 	'7', '1', '25', '5', '9', '23', '9'),
	('24', 'Math', 'Calculation', 'Geometry',    'Geo',     'Elementary Postulates',	'8', '1', '5',  '2', '1', '24', '5'),
	('25', 'Math', 'Calculation', 'Geometry',    'Geo',     'Lines & Angles', 			'8', '1', '20', '4', '2', '25', '5'),
	('26', 'Math', 'Calculation', 'Geometry',    'Geo',     'Similar Triangles', 		'8', '1', '20', '4', '3', '26', '5'),
	('27', 'Math', 'Calculation', 'Geometry',    'Geo',     'Quadrilaterals', 			'8', '1', '20', '4', '4', '27', '5'),
	('28', 'Math', 'Calculation', 'Geometry',    'Geo',     'Circles', 					'8', '1', '20', '4', '5', '28', '5');
   
INSERT INTO `demobooks`
	(`BookId`, `Subject`, `Category`, `Subcategory`, `SequenceName`, `Title`, `GradeLevel`, `Test`, `TimeAllowed`, `MistakesAllowed`, `Sequence`, `SequenceLarge`, `SequenceLength`)
VALUES  
	('29', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'A-G',       '0', '0', '0', '0', '1',  '1',  '10'),
	('30', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'H-M',       '0', '0', '0', '0', '2',  '2',  '10'),
	('31', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'N-S',       '0', '0', '0', '0', '3',  '3',  '10'),
	('32', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'T-Z',       '0', '0', '0', '0', '4',  '4',  '10'),
	('33', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'List 1-2',  '0', '0', '0', '0', '5',  '5',  '10'),
	('34', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'List 3-4',  '0', '0', '0', '0', '6',  '6',  '10'),
	('35', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'List 5-6',  '0', '0', '0', '0', '7',  '7',  '10'),
	('36', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'List 7-8',  '0', '0', '0', '0', '8',  '8',  '10'),
	('37', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'Tests 1-2', '0', '0', '0', '0', '9',  '9',  '10'),
	('38', 'Reading', 'Comprehension', 'Beginning Reading', 'Beg', 'Tests 3-4', '0', '0', '0', '0', '10', '10', '10'),
	('39', 'Reading', 'Comprehension', 'Vocabulary 1', 		'1st', 'List 1',    '1', '0', '0', '0', '1',  '11', '4'),
	('40', 'Reading', 'Comprehension', 'Stories 1', 		'1st', 'Book 1',    '1', '0', '0', '0', '2',  '12', '4'),
	('41', 'Reading', 'Comprehension', 'Vocabulary 1', 		'1st', 'List 2',    '1', '0', '0', '0', '3',  '13', '4'),
	('42', 'Reading', 'Comprehension', 'Stories 1', 		'1st', 'Book 2',    '1', '0', '0', '0', '4',  '14', '4'),
    ('43', 'Reading', 'Comprehension', 'Vocabulary 2', 		'2nd', 'List 1',    '2', '0', '0', '0', '1',  '15', '4'),
	('44', 'Reading', 'Comprehension', 'Stories 2', 		'2nd', 'Book 1',    '2', '0', '0', '0', '2',  '16', '4'),
	('45', 'Reading', 'Comprehension', 'Vocabulary 2', 		'2nd', 'List 2',    '2', '0', '0', '0', '3',  '17', '4'),
	('46', 'Reading', 'Comprehension', 'Stories 2', 		'2nd', 'Book 2',    '2', '0', '0', '0', '4',  '18', '4'),
    ('47', 'Reading', 'Comprehension', 'Vocabulary 3', 		'3rd', 'List 1',    '3', '0', '0', '0', '1',  '19', '5'),
	('48', 'Reading', 'Comprehension', 'Stories 3', 		'3rd', 'Book 1',    '3', '0', '0', '0', '2',  '20', '5'),
	('49', 'Reading', 'Comprehension', 'Vocabulary 3', 		'3rd', 'List 2',    '3', '0', '0', '0', '3',  '21', '5'),
	('50', 'Reading', 'Comprehension', 'Stories 3', 		'3rd', 'Book 2',    '3', '0', '0', '0', '4',  '22', '5'),
    ('51', 'Reading', 'Comprehension', 'Idioms 3',			'3rd', 'List 1',    '3', '0', '0', '0', '5',  '23', '5'),
    ('52', 'Reading', 'Comprehension', 'Vocabulary 4', 		'4th', 'List 1',    '4', '0', '0', '0', '1',  '24', '6'),
	('53', 'Reading', 'Comprehension', 'Stories 4', 		'4th', 'Book 1',    '4', '0', '0', '0', '2',  '25', '6'),
    ('54', 'Reading', 'Comprehension', 'Test Practice 4',	'4th', 'Test 1',    '4', '0', '0', '0', '3',  '26', '6'),
	('55', 'Reading', 'Comprehension', 'Vocabulary 4', 		'4th', 'List 2',    '4', '0', '0', '0', '4',  '27', '6'),
	('56', 'Reading', 'Comprehension', 'Stories 4', 		'4th', 'Book 2',    '4', '0', '0', '0', '5',  '28', '6'),
    ('57', 'Reading', 'Comprehension', 'Test Practice 4',	'4th', 'Test 2',    '4', '0', '0', '0', '6',  '29', '6');
