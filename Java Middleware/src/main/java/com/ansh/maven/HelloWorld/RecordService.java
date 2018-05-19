package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordService {

	List<Record> getAllRecords();
	List<Record> getRecordsById(int RecordId, String category, int months, String whichReps);
	List<Record> getIncompleteRecords();
	List<Record> getAllRecordsById(int StudentId, String category);
	int addRecord(String Client, String category, String subcategory, String title, Date startDate, int testTime, int mistakes, int rep);
	int updateRecord(String record, Date endDate);
}
