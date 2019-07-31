package com.ansh.maven.HelloWorld;

import java.util.List;

public interface StudentService {
	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	int getGrade(int StudentId);
	List<Student> getStudentsForList(boolean withData, int limit);
	List<Integer> getStudentIdsWithRecords();
	List<String> getCategories(int StudentId);
	int updateStudent(Student student, boolean isNew);
	int removeStudent(int studentId);
	int shiftGrades(boolean isInc);
}
