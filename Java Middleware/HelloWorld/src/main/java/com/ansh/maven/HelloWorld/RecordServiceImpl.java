package com.ansh.maven.HelloWorld;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecordServiceImpl implements RecordService{

	@Autowired
	RecordDao recordDao;
	
	@Autowired
	BookDao bookDao;
	
	@Autowired
	StudentDao studentDao;
	
	//Returns all records
	@Override
	public List<Record> getAllRecords() {
		return recordDao.getAllRecords();
	}
	
	// Returns records for a student within a certain range, plus or minus one record, with a specific category and rep count
	@Override
	public List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps) {
		studentDao.updateLastUsed(StudentId);
		return recordDao.getRecordsForChart(StudentId, category, months, until, whichReps);
	}
	
	// Gets records to include in a progress chart for a given student
	@Override
	public List<Record> getAllRecordsById(int StudentId) {
		return recordDao.getAllRecordsById(StudentId);
	}
	
	// Returns records without an end date
	@Override
	public List<Record> getIncompleteRecords() {
		return recordDao.getIncompleteRecords();
	}

	// Adds a record to the database
	@Override
	public int addRecord(Master master) {
		Book book = bookDao.getBookByName(master.getCategory(), master.getSubcategory(), master.getTitle());
		return recordDao.addRecord(master, book) + studentDao.updateLastUsed(master.getId());
	}

	// Updates a record in the database with an end date
	@Override
	public int updateRecord(Record record) {
		Book book = bookDao.getBookByName(record.getCategory(), record.getSubcategory(), record.getBookTitle());
		return recordDao.updateRecord(record, book) + studentDao.updateLastUsed(record.getStudentId());
	}
	
	
	
	// Gathers international goal line
	@Override
	public List<Data> getInternationalData(String category) {
		return recordDao.getInternationalData(category);
	}

}
