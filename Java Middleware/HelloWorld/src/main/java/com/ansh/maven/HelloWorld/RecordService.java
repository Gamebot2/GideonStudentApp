package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordService {
	List<Record> getAllRecords();
	List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps);
	List<Record> getIncompleteRecords();
	List<Record> getAllRecordsById(int StudentId);
	int updateRecord(Record record, boolean isNew);
	int removeRecord(int id);
	List<Data> getInternationalData(String category);
}
