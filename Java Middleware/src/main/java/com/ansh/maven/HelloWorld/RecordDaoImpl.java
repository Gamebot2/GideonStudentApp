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

	@Override
	public List<Record> getAllRecords() {
		// TODO Auto-generated method stub
		String sql = "SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId";
		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	@Override
	public List<Record> getRecordsById(int RecordId, String category, String whichReps) {
		// TODO Auto-generated method stub
		String cap = "'";
		if(!whichReps.equalsIgnoreCase("All")) {
			cap = "' AND records.Rep =  " + whichReps;
		} 
		
		String sql = "SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId ="
				+ " students.StudentId WHERE records.StudentId = " + RecordId + " AND book.category = '"
						+ category + cap;

		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	@Override
	public boolean recordExists(int RecordId) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int addRecord(String Client, String category, String subcategory, String title, Date startDate, int testTime, int mistakes, int rep) {
		// TODO Auto-generated method stub
		int bookId = 0, studentId = 0;
		boolean test = false;
		String cap = "";
		String booksql = "Select * FROM book";
		RowMapper<Book> bookRowMapper = new BookRowMapper();
		List<Book> bookList = this.jdbcTemplate.query(booksql, bookRowMapper);
		
		String studentsql = "SELECT * FROM students";
		RowMapper<Student> studentRowMapper = new StudentRowMapper();
		List<Student> studentList = this.jdbcTemplate.query(studentsql, studentRowMapper);
		
		for(Book b: bookList) {
			if(b.getTitle().equals(title) && b.getCategory().equals(category)) {
				bookId = b.getBook_id();
				if(b.getTest() > 0) {
					test = true;
				}
			}
		}
		
		for(Student s: studentList) {
			if(s.getClient().equalsIgnoreCase(Client)) {
				studentId = s.getStudentId();
			}
		}
		
		if(test) {
			cap = ", 1, " + testTime + ", " + mistakes + ")";
		} else {
			cap = ", 0, null, null)";
		}
		
		SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
		String formatted = format1.format(startDate);
		String recordsql = "INSERT INTO records (StudentId, BookId, StartDate, EndDate, Rep, Test, TestTime, Mistakes) VALUES (" + studentId + ", " + bookId + ", '" + formatted + "', null, " + rep + cap;
		System.out.println(recordsql);
		this.jdbcTemplate.update(recordsql);
		return 0;
	}

	@Override
	public int updateRecord(String record, Date endDate) {
		
		String[] brokenRecord = record.split(" ");
		String recordId = brokenRecord[brokenRecord.length-1];
		
		SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd");
		String formatted = format1.format(endDate);
		
		String updateSql = "UPDATE records SET endDate = '" + formatted + "' WHERE RecordId = " + recordId;
		System.out.println(updateSql);
		this.jdbcTemplate.update(updateSql);
		return 0;
	}

	@Override
	public List<Record> getIncompleteRecords() {
		// TODO Auto-generated method stub
		String sql = "SELECT * FROM records INNER JOIN book ON records.BookId = book.book_id INNER JOIN students ON records.StudentId = students.StudentId WHERE records.EndDate IS NULL";
		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	@Override
	public List<Record> getAllRecordsById(int StudentId, String category) {
		// TODO Auto-generated method stub
		String sql = "SELECT * FROM records INNER JOIN students ON records.StudentId = students.StudentId INNER JOIN book ON records.BookId = book.book_id WHERE students.StudentId = " + StudentId + " AND book.category = \"" + category + "\" AND records.rep = 1;";
		System.out.println(sql);
		RowMapper<Record> rowMapper = new RecordRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
}
