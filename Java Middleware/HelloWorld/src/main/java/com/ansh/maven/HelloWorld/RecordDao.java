package com.ansh.maven.HelloWorld;

import java.util.Date;
import java.util.List;

public interface RecordDao {
	List<Record> getAllRecords();
	List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps);
	List<Record> getAllRecordsById(int StudentId);
	List<Record> getIncompleteRecords();
	int addRecord(Master master, Book book);
	int updateRecord(Record record, Book book);
	int removeRecord(int id);
	List<Data> getInternationalData(String category);
}
