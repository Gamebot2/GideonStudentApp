-- create database
CREATE DATABASE `gideon` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE gideon;

-- books
CREATE TABLE `book` (
    `book_id` INT(11) NOT NULL,
    `subject` VARCHAR(25) DEFAULT NULL,
    `category` VARCHAR(255) DEFAULT NULL,
    `subcategory` VARCHAR(255) DEFAULT NULL,
    `title` VARCHAR(255) DEFAULT NULL,
    `gradeLevel` VARCHAR(255) DEFAULT NULL,
    `test` INT(11) NOT NULL,
    `timeAllowed` INT(11) NOT NULL,
    `mistakesAllowed` INT(11) NOT NULL,
    `sequence` INT(11) NOT NULL,
    `sequenceLarge` INT(11) NOT NULL,
    PRIMARY KEY (`book_id`),
    KEY `test_index` (`test`),
    KEY `timeAllowed_index` (`timeAllowed`),
    KEY `mistakesAllowed_index` (`mistakesAllowed`),
    KEY `sequence_index` (`sequence`),
    KEY `sequenceLarge_index` (`sequenceLarge`)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

-- records
CREATE TABLE `records` (
    `RecordId` INT(11) NOT NULL AUTO_INCREMENT,
    `StudentId` INT(11) NOT NULL,
    `BookId` INT(11) NOT NULL,
    `StartDate` DATETIME DEFAULT NULL,
    `EndDate` DATETIME DEFAULT NULL,
    `Rep` INT(11) NOT NULL,
    `Test` INT(11) NOT NULL,
    `TestTime` VARCHAR(255) DEFAULT NULL,
    `Mistakes` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (`RecordId`),
    KEY `StudentId_index` (`StudentId`),
    KEY `BookId_index` (`BookId`),
    KEY `Rep_index` (`Rep`),
    KEY `Test_index` (`Test`)
)  ENGINE=INNODB AUTO_INCREMENT=276 DEFAULT CHARSET=UTF8;

-- students
CREATE TABLE `students` (
    `StudentId` INT(11) NOT NULL AUTO_INCREMENT,
    `Client` VARCHAR(45) DEFAULT NULL,
    `Email` VARCHAR(255) DEFAULT NULL,
    `Phone` VARCHAR(45) DEFAULT NULL,
    `Address` VARCHAR(255) DEFAULT NULL,
    `Tenure` INT(11) NOT NULL,
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
    `ClientId` INT(11) NOT NULL,
    PRIMARY KEY (`StudentId`),
    KEY `Tenure_index` (`Tenure`),
    KEY `ClientId_index` (`ClientId`)
)  ENGINE=INNODB AUTO_INCREMENT=66 DEFAULT CHARSET=UTF8;






-- the queries below are very subtly different from the ones above, i'm sure

CREATE TABLE `book` (
  `book_id` int(11) NOT NULL,
  `subject` varchar(25) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `subcategory` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `gradeLevel` varchar(255) DEFAULT NULL,
  `test` int(11) NOT NULL,
  `timeAllowed` int(11) NOT NULL,
  `mistakesAllowed` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  `sequenceLarge` int(11) NOT NULL,
  PRIMARY KEY (`book_id`),
  KEY `test_index` (`test`),
  KEY `timeAllowed_index` (`timeAllowed`),
  KEY `mistakesAllowed_index` (`mistakesAllowed`),
  KEY `sequence_index` (`sequence`),
  KEY `sequenceLarge_index` (`sequenceLarge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `records` (
  `RecordId` int(11) NOT NULL AUTO_INCREMENT,
  `StudentId` int(11) NOT NULL,
  `BookId` int(11) NOT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `Rep` int(11) NOT NULL,
  `Test` int(11) NOT NULL,
  `TestTime` varchar(255) DEFAULT NULL,
  `Mistakes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`RecordId`),
  KEY `StudentId_index` (`StudentId`),
  KEY `BookId_index` (`BookId`),
  KEY `Rep_index` (`Rep`),
  KEY `Test_index` (`Test`)
) ENGINE=InnoDB AUTO_INCREMENT=276 DEFAULT CHARSET=utf8;

CREATE TABLE `students` (
  `StudentId` int(11) NOT NULL AUTO_INCREMENT,
  `Client` varchar(45) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Phone` varchar(45) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Tenure` int(11) DEFAULT NULL,
  `PlanOnHold` tinyint(1) DEFAULT NULL,
  `PaymentOnFile` tinyint(1) DEFAULT NULL,
  `LastMembershipEndDate` varchar(255) DEFAULT NULL,
  `NextPass` varchar(255) DEFAULT NULL,
  `CurrentPasses` varchar(255) DEFAULT NULL,
  `PrimaryStaffMember` varchar(45) DEFAULT NULL,
  `FirstName` varchar(25) DEFAULT NULL,
  `MiddleName` varchar(25) DEFAULT NULL,
  `LastName` varchar(25) DEFAULT NULL,
  `Grade` varchar(12) DEFAULT NULL,
  `Gender` varchar(12) DEFAULT NULL,
  `ClientId` int(11) DEFAULT NULL,
  PRIMARY KEY (`StudentId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;