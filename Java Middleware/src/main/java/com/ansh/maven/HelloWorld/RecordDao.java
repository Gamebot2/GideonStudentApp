package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordDao {
	List<Record> getAllRecords();
	List<Record> getRecordsById(int RecordId, String category, String whichReps);
	List<Record> getAllRecordsById(int StudentId, String category);
	List<Record> getIncompleteRecords();
	boolean recordExists(int RecordId);
	int addRecord(String Client, String category, String subcategory, String title, Date startDate, int testTime, int mistakes, int rep);
	int updateRecord(String record, Date endDate);
}
