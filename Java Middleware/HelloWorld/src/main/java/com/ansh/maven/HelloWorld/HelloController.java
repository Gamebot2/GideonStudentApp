package com.ansh.maven.HelloWorld;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
	
	@Autowired
	BookService bookService;
	
	@Autowired
	StudentService studentService;
	
	@Autowired
	RecordService recordService;
	
	@Autowired
	UserService userService;
	
	static User currentUser = null;
	
	public static boolean isLoggedIn() {
		return currentUser != null && currentUser.getTerminated() == 0;
	}
	static void setUser(User user) {
		currentUser = user;
	}
	
	public static String setTargetTable(String sql) {
		return isLoggedIn() ? sql.replaceAll("demo", "") : sql;
	}
	
	@CrossOrigin
	@RequestMapping("/login")
	public int login(@RequestParam("user") String user, @RequestParam("pass") String pass) {
		System.out.println(user + " attempted login");
		User result = userService.getLogIn(user, pass);
		
		setUser(result);
		return isLoggedIn() ? 0 : -1;
	}
	
	@CrossOrigin
	@RequestMapping("/logout")
	public int logout() {
		System.out.println("Logged out");
		setUser(null);
		return 0;
	}
	
	@CrossOrigin
	@RequestMapping("/getLoggedIn")
	public boolean getLoggedIn() {
		System.out.println("Fetched login: current status is " + isLoggedIn());
		return isLoggedIn();
	}
	
	@CrossOrigin
	@RequestMapping("/getUser")
	public List<String> getUser() {
		// Note: this method returns a list because for some reason, you can't return a string using $http because AngularJS thinks it's JSON
		System.out.println("Fetched user");
		List<String> output = new ArrayList<String>();
		output.add(isLoggedIn() ? currentUser.getUsername() : "");
		return output;
	}
	
	@CrossOrigin
	@RequestMapping("/register")
	public int register(@RequestParam("user") String user, @RequestParam("pass") String pass) {
		// this method doesn't do anything, haha. users must be registered directly into the database
		return 1337;
	}
	
	@CrossOrigin
	@RequestMapping("/terminateAccount")
	public int terminateAccount() {
		if (!isLoggedIn())
			return -1;
		System.out.println("Terminated account of " + currentUser.getUsername());
		return userService.terminateAccount(currentUser.getUsername());
	}
	
	//Returns all books in the book database
	@CrossOrigin
	@RequestMapping("/books")
	public List<Book> getAllBooks() {
		System.out.println("Method getAllBooks() called");
		return bookService.getAllBooks();
	}
	
	//Returns a specific book by name
	@CrossOrigin
	@RequestMapping("/book")
	public Book getBookByName(@RequestParam("Category") String category, @RequestParam("Subcategory") String subcategory, @RequestParam("Title") String title) {
		System.out.printf("Method getBookByName() called for category %s, subcategory %s, and title %s\n", category, subcategory, title);
		return bookService.getBookByName(category, subcategory, title);
	}
	
	//Returns all categories of books
	@CrossOrigin
	@RequestMapping("/categories")
	public List<String> getAllCategories() {
		System.out.println("Method getAllCategories() called");
		return bookService.getCategories();
	}
	
	//Returns all subcategories given a specific category
	@CrossOrigin
	@RequestMapping("/subcategories")
	public List<String> getSubcategories(@RequestParam("Category") String category) {
		System.out.println("Method getSubcategories() called for category " + category);
		return bookService.getSubcategories(category);
	}
	
	//Returns all titles given a specific subcategory
	@CrossOrigin
	@RequestMapping("/titles")
	public List<String> getTitles(@RequestParam("Subcategory") String subcategory) {
		System.out.println("Method getTitles() called for subcategory " + subcategory);
		return bookService.getTitles(subcategory);
	}
	
	//Returns all books, ordered in sequence, in a category
	@CrossOrigin
	@RequestMapping("/booksInCategory")
	public List<Book> getBooksInCategory(@RequestParam("Category") String category) {
		System.out.println("Method getBooksInCategory() called for category " + category);
		return bookService.getBooksInCategory(category);
	}
	
	@CrossOrigin
	@RequestMapping("/booksInSubcategory")
	public List<Book> getBookInSubcategory(@RequestParam("Category") String category, @RequestParam("Subcategory") String subcategory) {
		System.out.printf("Method getBooksInSubcategotry() called for category %s, subcategory %s\n", category, subcategory);
		return bookService.getBooksInSubcategory(category, subcategory);
	}
	
	//Returns all students in the student database
	@CrossOrigin
	@RequestMapping("/students")
	public List<Student> getAllStudents() {
		System.out.println("Method getAllStudents() called");
		return studentService.getAllStudents();
	}
	
	//Returns all data for a student given the student's ID
	@CrossOrigin
	@RequestMapping("/student")
	public Student getStudentById(@RequestParam("Id") int StudentId) {
		System.out.println("Method getStudentById() called for Student ID " + StudentId);
		return studentService.getStudentById(StudentId);
	}
	
	//Returns students ordered by recently used for the list display, with a specified limit (0 corresponds to no limit)
	@CrossOrigin
	@RequestMapping("/listStudents")
	public List<Student> getStudentsForList(@RequestParam("withData") boolean withData, @RequestParam("limit") int limit) {
		System.out.println("Method getStudentsForList() called " + (withData ? "with data " : "") + " with a limit of " + limit);
		return studentService.getStudentsForList(withData, limit);
	}
	
	@CrossOrigin
	@RequestMapping("/studentIdsWithRecords")
	public List<Integer> getStudentIdsWithRecords() {
		System.out.println("Method getStudentIdsWithRecords() called");
		return studentService.getStudentIdsWithRecords();
	}
	
	//Returns all categories that a student is working in
	@CrossOrigin
	@RequestMapping("/categoriesByStudent")
	public List<String> getCategories(@RequestParam("Id") int StudentId) {
		System.out.println("Method getCategories() called for Student ID " + StudentId);
		return studentService.getCategories(StudentId);
	}
	
	//Returns grade of the student as an integer value
	@CrossOrigin
	@RequestMapping("/gradeOfStudent")
	public int getGrade(@RequestParam("Id") int StudentId) {
		System.out.println("Method getGrade() called for Student ID " + StudentId);
		return studentService.getGrade(StudentId);
	}
	
	//Adds a new student to the students database
	@CrossOrigin
	@RequestMapping("/addStudent")
	public int addStudent(@RequestBody(required=false) StudentMaster student) {
		System.out.println("Method addStudent() called" );
		try {
			return studentService.addStudent(student);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method addStudent() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	
	//Edits student data in the students database
	@CrossOrigin
	@RequestMapping("/updateStudent")
	public int updateStudent(@RequestBody(required=false) Student student) {
		System.out.println("Method updateStudent() called");
		try {
			return studentService.updateStudent(student);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method updateStudent() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	
	//Deletes a student given an ID with which to delete
	@CrossOrigin
	@RequestMapping("/removeStudent")
	public int removeStudent(@RequestParam("Id") int id) {
		System.out.println("Method removeStudent() called on id " + id);
		try {
			return studentService.removeStudent(id);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method removeStudent() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	
	//Shifts all grades up or down
	@CrossOrigin
	@RequestMapping("/shiftGrades")
	public int shiftGrades(@RequestParam("isIncrementing") boolean isInc) {
		System.out.println("Method shiftGrades() called with intent to " + (isInc ? "increment" : "decrement"));
		try {
			return studentService.shiftGrades(isInc);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method shiftGrades() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	
	//Deletes a student given the ID with which to delete
	@CrossOrigin(origins = webOrigin)
	@RequestMapping("/removeStudents")
	public int removeStudent(@RequestParam("Id") int id) {
		System.out.println("Remove student called");
		return studentService.removeStudent(id);
	}
	
	//Returns all records in the record database
	@CrossOrigin
	@RequestMapping("/records")
	public List<Record> getAllRecords() {
		System.out.println("Method getAllRecords() called");
		return recordService.getAllRecords();
	}
	
	//Returns all records in the record database that do not have end dates
	@CrossOrigin
	@RequestMapping("/incompleteRecords")
	public List<Record> getIncompleteRecords() {
		System.out.println("Method getIncompleteRecords() called");
		return recordService.getIncompleteRecords();
	}
	
	//Returns all records for a given student and a given category with time and repetition constraints (NOTE: includes one record before/after the start time, useful for graphing)
	@CrossOrigin
	@RequestMapping("/recordsForChart")
	public List<Record> getRecordsForChart(@RequestParam("StudentId") int StudentId, @RequestParam("Category") String category, @RequestParam("Months") int months, @RequestParam("Until") int until, @RequestParam("Reps") String whichReps) {
		System.out.printf("Method getRecordsById() called for Student ID %d, category %s, month number %d, and until %d, for rep number %s\n", StudentId, category, months, until, whichReps);
		return recordService.getRecordsForChart(StudentId, category, months, until, whichReps);
	}
	
	//Returns all records for a given student and a given category
	@CrossOrigin
	@RequestMapping("/recordsById")
	public List<Record> getAllRecordsById(@RequestParam("StudentId") int StudentId) {
		System.out.println("Method getRecordsById() called for Student ID " + StudentId);
		return recordService.getAllRecordsById(StudentId);
	}
	
	//Adds a new record to the database
	@CrossOrigin
	@RequestMapping("/addRecord")
	public int addRecord(@RequestBody(required=false) Master master) {
		System.out.println("Method addRecord() called");
		try {
			return recordService.addRecord(master);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method addRecord() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	
	//Updates an existing record in the database
	@CrossOrigin
	@RequestMapping("/updateRecord")
	public int updateRecord(@RequestBody(required=false) Record record) {
		System.out.println("Method updateRecord() called");
		try {
			return recordService.updateRecord(record);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method updateRecord() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	
	//Deletes a record given an ID with which to delete
	@CrossOrigin
	@RequestMapping("/removeRecord")
	public int removeRecord(@RequestParam("Id") int id) {
		System.out.println("Method removeRecord() called on id " + id);
		try {
			return recordService.removeRecord(id);
		} catch (java.lang.RuntimeException e) {
			System.out.println("Method removeRecord() failed:");
			e.printStackTrace();
			return -1;
		}
	}
	

	//Gathers international goal line
	@CrossOrigin
	@RequestMapping("/internationalData")
	public List<Data> getInternationalData(@RequestParam("Category") String category) {
		System.out.println("Method getInternationalData() called for category " + category);
		return recordService.getInternationalData(category);
	}
}
