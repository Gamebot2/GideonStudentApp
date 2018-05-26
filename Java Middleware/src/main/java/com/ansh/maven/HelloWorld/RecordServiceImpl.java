package com.ansh.maven.HelloWorld;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.hibernate.validator.internal.util.privilegedactions.GetAnnotationParameter;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class RecordServiceImpl implements RecordService{

	@Autowired
	RecordDao recordDao;
	
	@Autowired
	JdbcTemplate template;
	
	@Override
	public List<Record> getAllRecords() {
		// TODO Auto-generated method stub
		return recordDao.getAllRecords();
	}

	@Override
	public List<Record> getRecordsById(int RecordId, String category, int months, String whichReps) {
		// TODO Auto-generated method stub
		List<Record> records = recordDao.getRecordsById(RecordId, category, whichReps);
		List<Record> returnRecords = new ArrayList<Record>();
		Date monthsAgo = new DateTime().minusMonths(months).toDate();
		for(Record r: records) {
			if(r.getStartDate().compareTo(monthsAgo) > 0) {
				returnRecords.add(r);
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
	public int addRecord(String Client, String category, String subcategory, String title, Date startDate, int rep) {
		// TODO Auto-generated method stub
		return recordDao.addRecord(Client, category, subcategory, title, startDate, rep);
	}

	@Override
	public int updateRecord(String record, Date endDate, int testTime, int minutes) {
		// TODO Auto-generated method stub
		return recordDao.updateRecord(record, endDate, testTime, minutes);
	}

	@Override
	public List<Record> getAllRecordsById(int StudentId, String category) {
		// TODO Auto-generated method stub
		return recordDao.getAllRecordsById(StudentId, category);
	}

}
