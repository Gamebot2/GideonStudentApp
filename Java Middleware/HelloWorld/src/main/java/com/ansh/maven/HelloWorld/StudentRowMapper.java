package com.ansh.maven.HelloWorld;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

public class StudentRowMapper implements RowMapper<Student>{

	@Override
	public Student mapRow(ResultSet row, int rowNum) throws SQLException {
		Student student = new Student();
		student.setClient(row.getString("Client"));
		student.setCurrentPasses(row.getString("CurrentPasses"));
		student.setEmail(row.getString("Email"));
		student.setPhone(row.getString("Phone"));
		student.setAddress(row.getString("Address"));
		student.setFirstName(row.getString("FirstName"));
		student.setGender(row.getString("Gender"));
		student.setGrade(row.getString("Grade"));
		student.setLastName(row.getString("LastName"));
		student.setStudentId(row.getInt("StudentId"));
		student.setLastUsed(row.getDate("LastUsed"));
		return student;
	}

}
