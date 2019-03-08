package com.ansh.maven.HelloWorld;

import java.util.*;

public interface StudentDao {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	List<Student> getStudentsForList(boolean withData, int limit);
	List<Integer> getStudentIdsWithRecords();
	String getGrade(int StudentId);
	List<String> getCategories(int StudentId);
	int updateStudent(Student student, boolean isNew);
	int updateLastUsed(int id);
	int removeStudent(int studentId);
	int shiftGrades(boolean isInc);
}
