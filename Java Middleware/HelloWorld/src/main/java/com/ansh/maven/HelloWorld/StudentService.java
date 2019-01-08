package com.ansh.maven.HelloWorld;

import java.util.List;
import java.util.Set;

public interface StudentService {

	List<Student> getAllStudents();
	Student getStudentById(int StudentId);
	int getGrade(int StudentId);
	List<Student> getStudentsForList(boolean withData, int limit);
	List<Integer> getStudentIdsWithRecords();
	List<String> getCategories(int StudentId);
	int addStudent(StudentMaster student);
	int updateStudent(Student student);
}
