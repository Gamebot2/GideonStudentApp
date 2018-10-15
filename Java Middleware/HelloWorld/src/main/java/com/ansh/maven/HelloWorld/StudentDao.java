package com.ansh.maven.HelloWorld;

import java.util.*;

public interface StudentDao {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	List<Student> getStudentsWithData();
	String getGrade(int StudentId);
	List<String> getCategories(int StudentId);
	int addStudent(StudentMaster student);
	int updateStudent(StudentMasterExtra s);
	int updateLastUsed(int id, boolean isRecord);
}
