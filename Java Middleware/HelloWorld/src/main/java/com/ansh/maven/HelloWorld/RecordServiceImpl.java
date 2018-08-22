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
		// TODO Auto-generated method stub
		return recordDao.getAllRecords();
	}
	
	//Gets records to include in a progress chart for a certain student, given a certain repetition number and a certain timeframe to plot
	@Override
	public List<Record> getRecordsById(int RecordId, String category, int months, String whichReps, int until) {
		// TODO Auto-generated method stub
		List<Record> records = recordDao.getRecordsById(RecordId, category, whichReps);
		List<Record> returnRecords = new ArrayList<Record>();
		
		DateTime dt = new DateTime().withTimeAtStartOfDay().withDayOfMonth(1);
		Date monthsAgo = dt.minusMonths(months).toDate();
		Date untilDate = dt.minusMonths(until - 1).toDate(); // subtracting 1 from until in order to display the entire most recent month, rather than just the beginning of it
		//System.out.println(monthsAgo.toString() + " , " + untilDate.toString());
		
		boolean firstRecordFlag = true;
		for(int r = 0; r < records.size(); r++) {
			Record currentRecord = records.get(r);
			if(currentRecord.getStartDate().compareTo(monthsAgo) > 0) {
				if (firstRecordFlag && r > 0) {
					returnRecords.add(records.get(r-1)); // adds one record before the timeframe, if possible
				}
				returnRecords.add(currentRecord);
				firstRecordFlag = false;
				
				if (currentRecord.getStartDate().compareTo(untilDate) > 0) { // adds one record after the timeframe, if possible
					break;
				}
			}
		}
		
		return returnRecords;
	}
	
	@Override
	public List<Record> getIncompleteRecords() {
		//TODO Auto-generated method stub
		return recordDao.getIncompleteRecords();
	}

	@Override
	public int addRecord(int id, String category, String subcategory, String title, Date startDate, int rep) {
		// TODO Auto-generated method stub
		Book book = bookDao.getBookByName(category, subcategory, title);
		return recordDao.addRecord(id, book, startDate, rep);
	}

	@Override
	public int updateRecord(int recordId, Date endDate, int testTime, int minutes) {
		// TODO Auto-generated method stub
		return recordDao.updateRecord(recordId, endDate, testTime, minutes);
	}

	@Override
	public List<Record> getAllRecordsById(int StudentId, String category) {
		// TODO Auto-generated method stub
		return recordDao.getAllRecordsById(StudentId, category);
	}

}
