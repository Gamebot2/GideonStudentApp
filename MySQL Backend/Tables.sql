-- create database
CREATE DATABASE `gideon` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE gideon;

-- books
CREATE TABLE `books` (
    `BookId` INT(11) NOT NULL,
    `Subject` VARCHAR(25) DEFAULT NULL,
    `Category` VARCHAR(255) DEFAULT NULL,
    `Subcategory` VARCHAR(255) DEFAULT NULL,
    `Title` VARCHAR(255) DEFAULT NULL,
    `GradeLevel` VARCHAR(255) DEFAULT NULL,
    `Test` INT(11) NOT NULL,
    `TimeAllowed` INT(11) NOT NULL,
    `MistakesAllowed` INT(11) NOT NULL,
    `Sequence` INT(11) NOT NULL,
    `SequenceLarge` INT(11) NOT NULL,
    PRIMARY KEY (`BookId`),
    KEY `Test_index` (`Test`),
    KEY `TimeAllowed_index` (`TimeAllowed`),
    KEY `MistakesAllowed_index` (`MistakesAllowed`),
    KEY `Sequence_index` (`Sequence`),
    KEY `SequenceLarge_index` (`SequenceLarge`)
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




