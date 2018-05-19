
CREATE DATABASE `gideon` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE gideon;
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
  `Tenure` int(11) NOT NULL,
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
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`StudentId`),
  KEY `Tenure_index` (`Tenure`),
  KEY `ClientId_index` (`ClientId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;