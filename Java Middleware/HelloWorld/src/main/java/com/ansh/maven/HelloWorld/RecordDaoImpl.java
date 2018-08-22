package com.ansh.maven.HelloWorld;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.aop.interceptor.ExposeBeanNameAdvisors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.session.SessionProperties.Jdbc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.module.SimpleAbstractTypeResolver;
import com.fasterxml.jackson.databind.ser.std.StdKeySerializers.StringKeySerializer;

@Transactional
@Repository
public class RecordDaoImpl implements RecordDao{

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private String sql;
	private RowMapper<Record> rowMapper;

	//Retrieves all records from every student in the database
	@Override
	public List<Record> getAllRecords() {
		// TODO Auto-generated method stub
		sql = "SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId";
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	//Returns all records of a student in a specific category and a specific repetition number
	@Override
	public List<Record> getRecordsById(int RecordId, String category, String whichReps) {
		// TODO Auto-generated method stub		
		sql = "SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId ="
				+ " students.StudentId WHERE records.StudentId = ? AND book.category = ? # ORDER BY StartDate";

		rowMapper = new RecordRowMapper();
		List<Record> output;
		
		if(whichReps.equalsIgnoreCase("All")) {		// Content of query depends on repetition selection
			sql = sql.replace("#","");
			output = this.jdbcTemplate.query(sql, rowMapper, RecordId, category);
		} else {
			sql = sql.replace("#", "AND records.Rep = ?");
			output = this.jdbcTemplate.query(sql, rowMapper, RecordId, category, whichReps);
		}
		return output;
	}

	//Unwritten and unused: returns whether or not a record exists given its ID
	@Override
	public boolean recordExists(int RecordId) {
		// TODO Auto-generated method stub
		return false;
	}

	//Adds a new record to the record database with all of the following information, formats the appropriate SQL string
	@Override
	public int addRecord(int studentId, Book book, Date startDate, int rep) {
		sql = "INSERT INTO records (StudentId, BookId, StartDate, EndDate, Rep, Test, TestTime, Mistakes) VALUES (?, ?, ?, null, ?, #, null, null)";
		
		if (book.getTest() > 0)				// Content of query depends on whether the book contains a test
			sql = sql.replace("#", "1");
		else
			sql = sql.replace("#", "0");
		
		SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
		String formatted = format1.format(startDate);
		
		System.out.println(sql);
		this.jdbcTemplate.update(sql, studentId, book.getBook_id(), formatted, rep);
		return 0;
	}

	//Updates an already existing record
	@Override
	public int updateRecord(int recordId, Date endDate, int testTime, int mistakes) {	
		SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
		String formatted = format1.format(endDate);
		
		sql = "UPDATE records SET endDate = ?, #  WHERE RecordId = ?";
		
		if(testTime < 0 || mistakes < 0) {		// Content of query depends on whether testTime and mistakes are valid values
			sql = sql.replace("#", "TestTime = null, mistakes = null");
			System.out.println(sql);
			this.jdbcTemplate.update(sql, formatted, recordId);
		} else {
			sql = sql.replace("#", "TestTime = ?, mistakes = ?");
			System.out.println(sql);
			this.jdbcTemplate.update(sql, formatted, testTime, mistakes, recordId);
		}
		return 0;
	}

	//Returns all records that have start dates, but do not have end dates
	@Override
	public List<Record> getIncompleteRecords() {
		// TODO Auto-generated method stub
		sql = "SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId WHERE records.EndDate IS NULL";
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	//Returns all records for a certain student and a certain category
	@Override
	public List<Record> getAllRecordsById(int StudentId, String category) {
		// TODO Auto-generated method stub
		sql = "SELECT * FROM records INNER JOIN students ON records.StudentId = students.StudentId INNER JOIN book ON records.BookId = book.book_id WHERE students.StudentId = ? AND book.category = ? AND records.rep = 1;";
		System.out.println(sql);
		rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper, StudentId, category);
	}
	
}
