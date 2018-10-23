package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordDao {
	List<Record> getAllRecords();
	List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps);
	List<Record> getAllRecordsById(int StudentId);
	List<Record> getIncompleteRecords();
	int addRecord(int id, Book book, Date startDate, int rep);
	int updateRecord(int recordId, Date endDate, int testTime, int minutes);
	List<Data> getInternationalData(String category);
}
