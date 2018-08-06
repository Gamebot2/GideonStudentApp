package com.ansh.maven.HelloWorld;

import java.util.List;

public interface StudentService {

	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	int getGrade(int StudentId);
	List<Student> getStudentsWithData();
	List<String> getCategories(int StudentId);
	int addStudent(String Client, String Grade, String Gender);
	int updateStudent(String studentId, String client, String email, String phone, String address, String grade, String gender, String currentPasses);
}
