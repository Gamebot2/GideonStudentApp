package com.ansh.maven.HelloWorld;

import java.util.*;

public interface StudentDao {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	boolean studentExists(String firstName, String lastName);
	List<Student> getStudentsWithData();
	List<String> getCategories(int StudentId);
}