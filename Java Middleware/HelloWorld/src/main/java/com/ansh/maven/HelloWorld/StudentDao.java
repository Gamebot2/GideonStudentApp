package com.ansh.maven.HelloWorld;

import java.util.*;

public interface StudentDao {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	List<Student> getStudentsForList(boolean withData, int limit);
	List<Integer> getStudentIdsWithRecords();
	String getGrade(int StudentId);
	List<String> getCategories(int StudentId);
	int addStudent(StudentMaster student);
	int updateStudent(Student s);
	int updateLastUsed(int id);
}
