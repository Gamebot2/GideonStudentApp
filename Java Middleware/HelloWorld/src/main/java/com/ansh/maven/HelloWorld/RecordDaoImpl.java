package com.ansh.maven.HelloWorld;

import java.text.SimpleDateFormat;
import java.util.*;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Transactional
@Repository
public class RecordDaoImpl implements RecordDao{

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

	//Retrieves all records from every student in the database
	@Override
	public List<Record> getAllRecords() {
		String sql = "SELECT * FROM records_joined";
		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
	//Returns all records that have start dates, but do not have end dates
	@Override
	public List<Record> getIncompleteRecords() {
		String sql = "SELECT * FROM records_joined WHERE EndDate IS NULL";
		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	//Returns all records for a certain student and a certain category
	@Override
	public List<Record> getAllRecordsById(int StudentId) {
		String sql = "SELECT * FROM records_joined WHERE StudentId = ?";
		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper, StudentId);
	}
	
	// Returns records for a student within a certain range, plus or minus one record, with a specific category and rep count
	@Override
	public List<Record> getRecordsForChart(int StudentId, String category, int months, int until, String whichReps) {
		String sql = "SELECT * FROM records_joined WHERE StudentId = ? AND Category = ? # AND StartDate IS NOT NULL ORDER BY StartDate ASC";
		RowMapper<Record> rowMapper = new RecordRowMapper();
		
		if(whichReps.equalsIgnoreCase("All")) {		// Content of query depends on repetition selection
			sql = sql.replace("#", "");
			return this.jdbcTemplate.query(sql, rowMapper, StudentId, category);
		} else {
			sql = sql.replace("#", "AND Rep = ?");
			return this.jdbcTemplate.query(sql, rowMapper, StudentId, category, whichReps);
		}
	}

	//Adds a new record to the record database with all of the following information, formats the appropriate SQL string
	@Override
	public int addRecord(Master master, Book book) {
		String sql = "INSERT INTO records (StudentId, BookId, StartDate, EndDate, Rep, Test, TestTime, Mistakes, Notes) VALUES (?, ?, ?, null, ?, ?, null, null, ?)";

		String formatted = dateFormat.format(master.getStartDate());
		this.jdbcTemplate.update(sql, master.getId(), book.getBookId(), formatted, master.getRep(), book.getTest(), master.getNotes());
		return 0;
	}

	//Updates an already existing record
	@Override
	public int updateRecord(Record record, Book book) {
		String sql = "UPDATE records SET StudentId = ?, BookId = ?, StartDate = ?, EndDate = ?, Rep = ?, TestTime = ?, Mistakes = ?, Notes = ? WHERE RecordId = ?";
		this.jdbcTemplate.update(sql, record.getStudentId(), book.getBookId(), record.getStartDate(), record.getEndDate(), record.getRep(), record.getTestTime(), record.getMistakes(), record.getNotes(), record.getRecordId());
		return 0;
	}
	
	
	
	// Gathers international goal line
	@Override
	public List<Data> getInternationalData(String category) {
		String sql = "SELECT * FROM internationaldata_joined WHERE Category = ?";
		RowMapper<Data> rowMapperD = new DataRowMapper();
		return this.jdbcTemplate.query(sql, rowMapperD, category);
	}
	
}
