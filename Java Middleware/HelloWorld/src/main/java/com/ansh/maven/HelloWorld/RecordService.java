package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordService {

	List<Record> getAllRecords();
	List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps);
	List<Record> getIncompleteRecords();
	List<Record> getAllRecordsById(int StudentId, String category);
	int addRecord(int id, String category, String subcategory, String title, Date startDate, int rep);
	int updateRecord(int recordId, Date endDate, int testTime, int minutes);
	List<Data> getInternationalData(String category);
}
