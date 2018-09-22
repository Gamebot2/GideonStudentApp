package com.ansh.maven.HelloWorld;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

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
		System.out.println(sql);
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper, StudentId, category);
	}
	
	// Returns records for a student within a certain range, plus or minus one record, with a specific category and rep count
	@Override
	public List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps) {
		sql = "SELECT * FROM books b INNER JOIN ("
				+ "(SELECT * FROM records WHERE StudentId = ? AND StartDate < ? ORDER BY StartDate DESC LIMIT 1) UNION" // note: this sql query can be edited and tested in the MainScript file in the backend
				+ "(SELECT * FROM records WHERE StudentId = ? AND StartDate > ? ORDER BY StartDate ASC LIMIT 1) UNION"
				+ "(SELECT * FROM records WHERE StudentId = ? AND StartDate >= ? AND StartDate <= ?))"
				+ "r ON r.BookId = b.BookId INNER JOIN students s ON r.StudentId = s.StudentId WHERE b.Category = ? # ORDER BY r.StartDate";
		
		rowMapper = new RecordRowMapper();
		List<Record> output;
		
		DateTime dt = new DateTime().withTimeAtStartOfDay().withDayOfMonth(1);
		Date monthsDate = dt.minusMonths(months).toDate();
		Date untilDate =  dt.minusMonths(until - 1).toDate(); // subtracting 1 from until in order to display the entire most recent month, rather than just the beginning of it
		
		if(whichReps.equalsIgnoreCase("All")) {		// Content of query depends on repetition selection
			sql = sql.replace("#","");
			System.out.println(sql);
			output = this.jdbcTemplate.query(sql, rowMapper, StudentId, monthsDate, StudentId, untilDate, StudentId, monthsDate, untilDate, category);
		} else {
			sql = sql.replace("#", "AND r.Rep = ?");
			System.out.println(sql);
			output = this.jdbcTemplate.query(sql, rowMapper, StudentId, monthsDate, StudentId, untilDate, StudentId, monthsDate, untilDate, category, whichReps);
		}
		return output;
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
		
		System.out.println(sql);
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
			System.out.println(sql);
			this.jdbcTemplate.update(sql, formatted, recordId);
		} else {
			sql = sql.replace("#", "?");
			System.out.println(sql);
			this.jdbcTemplate.update(sql, formatted, testTime, mistakes, recordId);
		}
		return 0;
	}
	
	
	
	// Gathers international goal line
	@Override
	public List<Data> getInternationalData(String category) {
		sql = "SELECT * FROM internationaldata WHERE Category = ?";
		rowMapperD = new DataRowMapper();
		return this.jdbcTemplate.query(sql, rowMapperD, category);
	}
	
}
