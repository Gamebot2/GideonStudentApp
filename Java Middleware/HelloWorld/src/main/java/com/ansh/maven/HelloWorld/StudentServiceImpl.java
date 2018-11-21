package com.ansh.maven.HelloWorld;

import java.util.List;

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

	// Adds a student to the database
	@Override
	public int addStudent(StudentMaster student) {
		return studentDao.addStudent(student);
	}
	
	// Updates student information in the database
	@Override
	public int updateStudent(Student student) {
		return studentDao.updateStudent(student) + studentDao.updateLastUsed(student.getStudentId());
	}
	
}
