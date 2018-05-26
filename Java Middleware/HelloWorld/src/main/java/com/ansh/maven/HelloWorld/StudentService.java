package com.ansh.maven.HelloWorld;

import java.util.List;

public interface StudentService {

	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	List<Student> getStudentsWithData();
	List<String> getCategories(int StudentId);
}
