package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordService {

	List<Record> getAllRecords();
	List<Record> getRecordsById(int RecordId, String category, int months, String whichReps, int until);
	List<Record> getIncompleteRecords();
	List<Record> getAllRecordsById(int StudentId, String category);
	int addRecord(int id, String category, String subcategory, String title, Date startDate, int rep);
	int updateRecord(int recordId, Date endDate, int testTime, int minutes);
}
