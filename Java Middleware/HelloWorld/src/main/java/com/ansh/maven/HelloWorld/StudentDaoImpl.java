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
	
	private String sql;
	private RowMapper<Student> rowMapper;

	// Returns all students in the database
	@Override
	public List<Student> getAllStudents() {
		sql = "SELECT * FROM students";
		rowMapper = new StudentRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	// Returns a single student with a certain id number
	@Override
	public Student getStudentById(int StudentId) {
		sql = "SELECT * FROM students WHERE StudentId = ?";
		rowMapper = new StudentRowMapper();
		return jdbcTemplate.queryForObject(sql, rowMapper, StudentId);
	}

	// Unused and unwritten: returns a single student by their first and last name
	@Override
	public boolean studentExists(String firstName, String lastName) {
		// TODO Auto-generated method stub
		return false;
	}

	// Returns the students in the database that have records associated with them
	@Override
	public List<Student> getStudentsWithData() {
		sql = "SELECT DISTINCT students.StudentId, students.Client, students.Email, students.Phone, students.Address, students.ClientId, students.CurrentPasses, students.FirstName,\r\n" + 
				"students.Gender, students.Grade, students.LastName, students.MiddleName, students.PrimaryStaffMember\r\n" + 
				"FROM students RIGHT JOIN records ON records.StudentId = students.StudentId;";
		rowMapper = new StudentRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	// Returns the categories of books for which a student has records
	@Override
	public List<String> getCategories(int StudentId) {
		sql = "SELECT DISTINCT book.category FROM records INNER JOIN students ON records.StudentId = students.StudentId INNER JOIN book ON records.BookId = book.book_id WHERE students.StudentId = ?";
		return this.jdbcTemplate.queryForList(sql, String.class, StudentId + ";");
	
	}

	// Adds a student to the database
	@Override
	public int addStudent(String Client, String Grade, String Gender) {
		StudentMaster student1 = new StudentMaster(Client, Grade, Gender);
		
		sql = "INSERT INTO students (Client, FirstName, LastName, Grade, Gender) VALUES (?, ?, ?, ?, ?);";
		//System.out.println(sql);
		this.jdbcTemplate.update(sql, Client, student1.getFirstName(), student1.getLastName(), student1.getGrade(), student1.getGender());
		return 0;
	}
	
	// Updates student information in the database
	@Override
	public int updateStudent(String studentId, String client, String email, String phone, String address, String grade, String gender, String currentPasses) {
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
		
		sql = "UPDATE students SET Client = ?, Email = ?, Phone = ?, Address = ?, Grade = ?, Gender = ?, CurrentPasses = ? WHERE StudentId = ?";
		System.out.println(sql);
		this.jdbcTemplate.update(sql, client, email, phone, address, grade, gender, currentPasses, studentId);
		return 0;
	}
}
