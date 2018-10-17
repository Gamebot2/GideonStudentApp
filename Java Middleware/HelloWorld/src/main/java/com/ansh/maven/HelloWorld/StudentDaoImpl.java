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
public class StudentDaoImpl implements StudentDao {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	// Returns all students in the database
	@Override
	public List<Student> getAllStudents() {
		String sql = "SELECT * FROM students ORDER BY LastUsed DESC";
		RowMapper<Student> rowMapper = new StudentRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	// Returns a single student with a certain id number
	@Override
	public Student getStudentById(int StudentId) {
		String sql = "SELECT * FROM students WHERE StudentId = ?";
		RowMapper<Student> rowMapper = new StudentRowMapper();
		return jdbcTemplate.queryForObject(sql, rowMapper, StudentId);
	}

	// Returns the students in the database that have records associated with them
	@Override
	public List<Student> getStudentsWithData() {
		String sql = "SELECT * FROM students s WHERE s.StudentId IN (SELECT DISTINCT StudentId FROM records r) ORDER BY LastUsed DESC";
		RowMapper<Student> rowMapper = new StudentRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
	// Returns the grade of a single student
	@Override
	public String getGrade(int StudentId) {
		String sql = "SELECT Grade FROM students WHERE StudentId = ? LIMIT 1";
		return jdbcTemplate.queryForObject(sql, String.class, StudentId);
	}

	// Returns the categories of books for which a student has records
	@Override
	public List<String> getCategories(int StudentId) {
		String sql = "SELECT DISTINCT books.Category FROM records INNER JOIN students ON records.StudentId = students.StudentId INNER JOIN books ON records.BookId = books.BookId WHERE students.StudentId = ?";
		return this.jdbcTemplate.queryForList(sql, String.class, StudentId);
	}

	// Adds a student to the database
	@Override
	public int addStudent(StudentMaster student) {
		String sql = "INSERT INTO students (Client, FirstName, LastName, Grade, Gender, LastUsed) VALUES (?, ?, ?, ?, ?, ?);";
		this.jdbcTemplate.update(sql, student.getClient(), student.getFirstName(), student.getLastName(), student.getGrade(), student.getGender(), dateFormat.format(new Date()));
		return 0;
	}
	
	// Updates student information in the database
	@Override
	public int updateStudent(StudentMasterExtra s) {
		String sql = "UPDATE students SET Client = ?, Email = ?, Phone = ?, Address = ?, Grade = ?, Gender = ?, CurrentPasses = ? WHERE StudentId = ?";
		this.jdbcTemplate.update(sql, s.getClient(), s.getEmail(), s.getPhone(), s.getAddress(), s.getGrade(), s.getGender(), s.getCurrentPasses(), s.getStudentId());
		return 0;
	}
	
	
	// Sets the last used date of the student with either a studentId or a recordId
	@Override
	public int updateLastUsed(int id, boolean isRecordId) {
		String sql = "UPDATE students SET LastUsed = ? WHERE StudentId = ?;";
		if (isRecordId)
			sql = sql.replace("?;", "(SELECT StudentId FROM records WHERE RecordId = ?)");
		
		this.jdbcTemplate.update(sql, dateFormat.format(new Date()), id);
		return 0;
	}
}
