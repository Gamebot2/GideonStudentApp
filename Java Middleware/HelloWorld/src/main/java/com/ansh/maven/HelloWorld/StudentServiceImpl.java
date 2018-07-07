package com.ansh.maven.HelloWorld;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService{
	
	@Autowired
	StudentDao studentDao;

	@Override
	public List<Student> getAllStudents() {
		// TODO Auto-generated method stub
		return studentDao.getAllStudents();
	}

	@Override
	public Student getStudentById(int StudentId) {
		// TODO Auto-generated method stub
		Student obj = studentDao.getStudentById(StudentId);
		return obj;
	}

	@Override
	public List<Student> getStudentsWithData() {
		// TODO Auto-generated method stub
		return studentDao.getStudentsWithData();
	}

	@Override
	public List<String> getCategories(int StudentId) {
		// TODO Auto-generated method stub
		return studentDao.getCategories(StudentId);
	}

	@Override
	public int getGrade(int StudentId) {
		Student obj = studentDao.getStudentById(StudentId);
		String gradeString = obj.getGrade();
		int grade = Integer.parseInt(gradeString.substring(0, 1));
		return grade;
	}

	@Override
	public int addStudent(String Client, String Grade, String Gender) {
		// TODO Auto-generated method stub
		return studentDao.addStudent(Client, Grade, Gender);
	}
	
}
