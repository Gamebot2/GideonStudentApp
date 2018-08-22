package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordDao {
	List<Record> getAllRecords();
	List<Record> getRecordsById(int RecordId, String category, String whichReps);
	List<Record> getAllRecordsById(int StudentId, String category);
	List<Record> getIncompleteRecords();
	boolean recordExists(int RecordId);
	int addRecord(int id, Book book, Date startDate, int rep);
	int updateRecord(int recordId, Date endDate, int testTime, int minutes);
}
