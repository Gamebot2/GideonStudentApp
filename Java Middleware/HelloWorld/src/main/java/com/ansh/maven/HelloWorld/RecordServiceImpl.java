package com.ansh.maven.HelloWorld;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class RecordServiceImpl implements RecordService{

	@Autowired
	RecordDao recordDao;
	
	@Autowired
	BookDao bookDao;
	
	//Returns all records
	@Override
	public List<Record> getAllRecords() {
		return recordDao.getAllRecords();
	}
	
	// Returns records for a student within a certain range, plus or minus one record, with a specific category and rep count
	@Override
	public List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps) {
		return recordDao.getRecordsForChart(StudentId, category, months, until, whichReps);
	}
	
	// Gets records to include in a progress chart for a given student
	@Override
	public List<Record> getAllRecordsById(int StudentId, String category) {
		return recordDao.getAllRecordsById(StudentId, category);
	}
	
	// Returns records without an end date
	@Override
	public List<Record> getIncompleteRecords() {
		return recordDao.getIncompleteRecords();
	}

	// Adds a record to the database
	@Override
	public int addRecord(int id, String category, String subcategory, String title, Date startDate, int rep) {
		Book book = bookDao.getBookByName(category, subcategory, title);
		return recordDao.addRecord(id, book, startDate, rep);
	}

	// Updates a record in the database with an end date
	@Override
	public int updateRecord(int recordId, Date endDate, int testTime, int minutes) {
		return recordDao.updateRecord(recordId, endDate, testTime, minutes);
	}
	
	
	
	// Gathers international goal line
	@Override
	public List<Data> getInternationalData(String category) {
		return recordDao.getInternationalData(category);
	}

}
