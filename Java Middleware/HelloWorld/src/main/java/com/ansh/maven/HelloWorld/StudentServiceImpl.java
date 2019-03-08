package com.ansh.maven.HelloWorld;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService{
	
	@Autowired
	StudentDao studentDao;

	// Returns all students in the database
	@Override
	public List<Student> getAllStudents() {
		return studentDao.getAllStudents();
	}

	// Returns a single student with a certain id number
	@Override
	public Student getStudentById(int StudentId) {
		Student obj = studentDao.getStudentById(StudentId);
		return obj;
	}

	// Returns students ordered by recently used for the list display, with a specified limit (0 corresponds to no limit)
	@Override
	public List<Student> getStudentsForList(boolean withData, int limit) {
		return studentDao.getStudentsForList(withData, limit);
	}
	
	@Override
	public List<Integer> getStudentIdsWithRecords() {
		return studentDao.getStudentIdsWithRecords();
	}

	// Returns all book categories for which a student has records
	@Override
	public List<String> getCategories(int StudentId) {
		return studentDao.getCategories(StudentId);
	}

	// Returns the numeric grade of a student
	@Override
	public int getGrade(int StudentId) {
		String gradeString = studentDao.getGrade(StudentId);
		if (gradeString == null || !gradeString.matches(".*\\d.*"))
			return -1;
		else
			return Integer.parseInt(gradeString.replaceAll("\\D+",""));
	}

	
	// NOTE: Anything that modifies data in the database will do nothing if the user is accessing the demo database: 1 will be returned
	
	// Updates student information in the database
	@Override
	public int updateStudent(Student student, boolean isNew) {
		if (!HelloController.isLoggedIn())
			return 1;
		
		return studentDao.updateStudent(student, isNew) + (isNew ? 0 : studentDao.updateLastUsed(student.getStudentId()));
	}
	// Removes a student and their records from the database
	@Override
	public int removeStudent(int studentId) {
		if (!HelloController.isLoggedIn())
			return 1;
		
		return studentDao.removeStudent(studentId);
	}
	
	// Shifts all grades up or down
	@Override
	public int shiftGrades(boolean isInc) {
		if (!HelloController.isLoggedIn())
			return 1;
		
		return studentDao.shiftGrades(isInc);
	}
	
}
