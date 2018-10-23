package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordService {

	List<Record> getAllRecords();
	List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps);
	List<Record> getIncompleteRecords();
	List<Record> getAllRecordsById(int StudentId);
	int addRecord(int studentId, String category, String subcategory, String title, Date startDate, int rep);
	int updateRecord(Record record);
	List<Data> getInternationalData(String category);
}
