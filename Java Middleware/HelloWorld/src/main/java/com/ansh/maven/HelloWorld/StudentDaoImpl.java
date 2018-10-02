package com.ansh.maven.HelloWorld;

import java.util.List;

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

	// Returns all students in the database
	@Override
	public List<Student> getAllStudents() {
		String sql = "SELECT * FROM students";
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
		String sql = "SELECT DISTINCT s.StudentId, s.Client, s.Email, s.Phone, s.Address, s.ClientId, s.CurrentPasses, s.FirstName, s.Gender, s.Grade, s.LastName, s.MiddleName, s.PrimaryStaffMember FROM students s RIGHT JOIN records r ON r.StudentId = s.StudentId";
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
		String sql = "INSERT INTO students (Client, FirstName, LastName, Grade, Gender) VALUES (?, ?, ?, ?, ?);";
		this.jdbcTemplate.update(sql, student.getClient(), student.getFirstName(), student.getLastName(), student.getGrade(), student.getGender());
		return 0;
	}
	
	// Updates student information in the database
	@Override
	public int updateStudent(int studentId, String client, String email, String phone, String address, String grade, String gender, String currentPasses) {
		if (client == null)
			client = "";
		if (email == null)
			email = "";
		if (phone == null)
			phone = "";
		if (address == null)
			address = "";
		if (currentPasses == null)
			currentPasses = "";
		
		String sql = "UPDATE students SET Client = ?, Email = ?, Phone = ?, Address = ?, Grade = ?, Gender = ?, CurrentPasses = ? WHERE StudentId = ?";
		this.jdbcTemplate.update(sql, client, email, phone, address, grade, gender, currentPasses, studentId);
		return 0;
	}
}
