package com.ansh.maven.HelloWorld;

import java.util.*;

public interface StudentDao {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	boolean studentExists(String firstName, String lastName);
	List<Student> getStudentsWithData();
	List<String> getCategories(int StudentId);
	int addStudent(String Client, String Grade, String Gender);
	int updateStudent(String studentId, String client, String email, String phone, String address, String grade, String gender, String currentPasses);
}
