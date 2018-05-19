package com.ansh.maven.HelloWorld;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.validator.internal.util.privilegedactions.GetAnnotationParameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
	
	public final String webOrigin = "http://localhost:8081";
	
	@Autowired
	BookService bookService;
	
	@Autowired
	StudentService studentService;
	
	@Autowired
	RecordService recordService;
	
	//Returns all books in the book database
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/books")
	public List<Book> getAllBooks() {
		System.out.println("Method getAllBooks() called");
		return bookService.getAllBooks();
	}
	
	//Returns all subcategories given a specific category
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/subcategories")
	public List<String> getSubcategories(@RequestParam("Category") String category) {
		System.out.println("Method getSubcategories() called for category " + category);
		return bookService.getSubcategories(category);
	}
	
	//Returns all titles given a specific subcategory
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/titles")
	public List<String> getTitles(@RequestParam("Subcategory") String subcategory) {
		System.out.println("Method getTitles() called for subcategory " + subcategory);
		return bookService.getTitles(subcategory);
	}
	
	//Returns all students in the student database
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/students")
	public List<Student> getAllStudents() {
		System.out.println("Method getAllStudents() called");
		return studentService.getAllStudents();
	}
	
	//Returns all data for a student given the student's ID
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/student")
	public Student getStudentById(@RequestParam("Id") int StudentId) {
		System.out.println("Method getStudentById() called for Student ID " + StudentId);
		return studentService.getStudentById(StudentId);
	}
	
	//Returns all students who have records in the record database
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/dataStudents")
	public List<Student> getStudentsWithData() {
		System.out.println("Method getStudentsWithData() called");
		return studentService.getStudentsWithData();
	}
	
	//Returns all categories that a student is working in
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("categoriesByStudent")
	public List<String> getCategories(@RequestParam("Id") int StudentId) {
		System.out.println("Method getCategories() called for Student ID " + StudentId);
		return studentService.getCategories(StudentId);
	}
	
	//Returns all records in the record database
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/records")
	public List<Record> getAllRecords() {
		System.out.println("Method getAllRecords() called");
		return recordService.getAllRecords();
	}
	
	//Returns all records in the record database that do not have end dates
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/incompleteRecords")
	public List<Record> getIncompleteRecords() {
		System.out.println("Method getIncompleteRecords() called");
		return recordService.getIncompleteRecords();
	}
	
	//Returns all records for a given student
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/recordsById")
	@ResponseBody
	public List<Record> getRecordsById(@RequestParam("StudentId") int StudentId, @RequestParam("Category") String category, @RequestParam("Months") String months, @RequestParam("Reps") String whichReps) {
		int monthNumber;
		if(months.equals(null) || months.isEmpty()) {
			monthNumber = 12;
		} else {
			monthNumber = Integer.parseInt(months);
		}
		System.out.println("Method getRecordsById() called for Student ID " + StudentId + ", category " + category + ", month number " + months + ", and rep number " + whichReps);
		return recordService.getRecordsById(StudentId, category, monthNumber, whichReps);
	}
	
	//Returns all records for a given student and a given category
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/allRecordById")
	public List<Record> getAllRecordsById(@RequestParam("StudentId") int StudentId, @RequestParam("Category") String category) {
		System.out.println("Method getRecordsById() called for Student ID " + StudentId + " and category " + category);
		return recordService.getAllRecordsById(StudentId, category);
	}
	
	//Adds a new record to the database
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/addRecord")
	public int addRecord(@RequestBody(required=false) Master master) {
		System.out.println("Method addRecord() called");
		int a = recordService.addRecord(master.getClient(), master.getCategory(), master.getSubcategory(), master.getTitle(), master.getStartDate(), master.getTestTime(), master.getMistakes(), master.getRep());
		return a;
	}
	
	//Updates an existing record in the database
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/updateRecord")
	public int updateRecord(@RequestParam("record") String record, @RequestParam("endDate") Date endDate) {
		System.out.println("Method updateRecord() called");
		int a = recordService.updateRecord(record, endDate);
		return a;
	}
	
}
