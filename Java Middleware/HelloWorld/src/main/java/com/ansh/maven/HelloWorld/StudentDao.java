package com.ansh.maven.HelloWorld;

import java.util.*;

public interface StudentDao {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	List<Student> getStudentsWithData();
	List<String> getGrade(int StudentId);
	List<String> getCategories(int StudentId);
	int addStudent(StudentMaster student);
	int updateStudent(int studentId, String client, String email, String phone, String address, String grade,
			String gender, String currentPasses);
}
