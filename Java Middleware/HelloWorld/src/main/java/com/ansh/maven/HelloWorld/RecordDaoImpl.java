package com.ansh.maven.HelloWorld;

import java.text.SimpleDateFormat;
import java.util.*;

import javax.transaction.Transactional;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public class RecordDaoImpl implements RecordDao{

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private String sql;
	private RowMapper<Record> rowMapper;
	private RowMapper<Data> rowMapperD;

	private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	
	//Retrieves all records from every student in the database
	@Override
	public List<Record> getAllRecords() {
		sql = "SELECT * FROM records INNER JOIN books ON records.BookId = books.BookId INNER JOIN students ON records.StudentId = students.StudentId";
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
	//Returns all records that have start dates, but do not have end dates
	@Override
	public List<Record> getIncompleteRecords() {
		sql = "SELECT * FROM records INNER JOIN books ON records.BookId = books.BookId INNER JOIN students ON records.StudentId = students.StudentId WHERE records.EndDate IS NULL";
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	//Returns all records for a certain student and a certain category
	@Override
	public List<Record> getAllRecordsById(int StudentId, String category) {
		sql = "SELECT * FROM records INNER JOIN students ON records.StudentId = students.StudentId INNER JOIN books ON records.BookId = books.BookId WHERE students.StudentId = ? AND books.Category = ? AND records.rep = 1;";
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper, StudentId, category);
	}
	
	// Returns records for a student within a certain range, plus or minus one record, with a specific category and rep count
	// Logic has been returned back to Java, because the SQL logic had significant problems with repetition
	@Override
	public List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps) {
		sql = "SELECT * FROM records r JOIN books b ON r.BookId = b.BookId JOIN students s ON r.StudentId = s.StudentId WHERE r.StudentId = ? AND b.Category = ? # ORDER BY r.StartDate";
		rowMapper = new RecordRowMapper();
		List<Record> allRecords,
					 returnRecords = new ArrayList<Record>();
		
		if(whichReps.equalsIgnoreCase("All")) {		// Content of query depends on repetition selection
			sql = sql.replace("#","");
			allRecords = this.jdbcTemplate.query(sql, rowMapper, StudentId, category);
		} else {
			sql = sql.replace("#", "AND r.Rep = ?");
			allRecords = this.jdbcTemplate.query(sql, rowMapper, StudentId, category, whichReps);
		}

		// Pruning list to include just the time period
		DateTime dt = new DateTime().withTimeAtStartOfDay().withDayOfMonth(1);
		Date monthsDate = dt.minusMonths(months   ).toDate(),
		     untilDate  = dt.minusMonths(until - 1).toDate(); // subtracting 1 from until in order to display the entire most recent month, rather than just the beginning of it
		
		for(int r = 0; r < allRecords.size(); r++) {
			Record currR = allRecords.get(r);
			
			if(currR.getStartDate().compareTo(monthsDate) > 0) {
				if (returnRecords.isEmpty() && r > 0)
					returnRecords.add(allRecords.get(r-1)); // adds one record before the timeframe, if possible
				returnRecords.add(currR);
				if (currR.getStartDate().compareTo(untilDate) > 0) // adds one record after the timeframe, if possible
					break;
			}
		}
		
		return returnRecords;
	}

	//Adds a new record to the record database with all of the following information, formats the appropriate SQL string
	@Override
	public int addRecord(int studentId, Book book, Date startDate, int rep) {
		sql = "INSERT INTO records (StudentId, BookId, StartDate, EndDate, Rep, Test, TestTime, Mistakes) VALUES (?, ?, ?, null, ?, #, null, null)";
		
		if (book.getTest() > 0)				// Content of query depends on whether the book contains a test
			sql = sql.replace("#", "1");
		else
			sql = sql.replace("#", "0");
		
		String formatted = dateFormat.format(startDate);
		this.jdbcTemplate.update(sql, studentId, book.getBookId(), formatted, rep);
		return 0;
	}

	//Updates an already existing record
	@Override
	public int updateRecord(int recordId, Date endDate, int testTime, int mistakes) {	
		sql = "UPDATE records SET EndDate = ?, TestTime = #, Mistakes = #  WHERE RecordId = ?";
		
		String formatted = dateFormat.format(endDate);
		
		if(testTime < 0 || mistakes < 0) {		// Content of query depends on whether testTime and mistakes are valid values
			sql = sql.replaceAll("#", "null");
			this.jdbcTemplate.update(sql, formatted, recordId);
		} else {
			sql = sql.replace("#", "?");
			this.jdbcTemplate.update(sql, formatted, testTime, mistakes, recordId);
		}
		return 0;
	}
	
	
	
	// Gathers international goal line
	@Override
	public List<Data> getInternationalData(String category) {
		sql = "SELECT i.DataId, i.Category, i.BookId, i.Grade, b.SequenceLarge FROM internationaldata i JOIN books b ON i.BookId = b.BookId WHERE i.Category = ? ORDER BY b.SequenceLarge";
		rowMapperD = new DataRowMapper();
		return this.jdbcTemplate.query(sql, rowMapperD, category);
	}
	
}
