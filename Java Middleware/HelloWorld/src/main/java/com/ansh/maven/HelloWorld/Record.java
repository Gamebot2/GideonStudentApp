package com.ansh.maven.HelloWorld;

import java.util.*;

public class Record {
	
	private int RecordId;
	private int StudentId;
	private int BookId;
	private Date StartDate;
	private Date EndDate;
	private int Rep;
	private int Test;
	private int TestTime;
	private int Mistakes;
	private String Notes;
	private String name;
	private int sequenceLarge;
	private String bookTitle;
	private String subcategory;
	private String category;
	
	public Record() {
		super();
	}

	public Record(int recordId, int studentId, int bookId, Date startDate, Date endDate, int rep, int test,
			int testTime, int mistakes, String notes) {
		super();
		RecordId = recordId;
		StudentId = studentId;
		BookId = bookId;
		StartDate = startDate;
		EndDate = endDate;
		Rep = rep;
		Test = test;
		TestTime = testTime;
		Mistakes = mistakes;
		Notes = notes;
	}
	
	public String getCategory() {
		return category;
	}
	
	public void setCategory(String category) {
		this.category = category;
	}
	
	public String getSubcategory() {
		return subcategory;
	}

	public void setSubcategory(String subcategory) {
		this.subcategory = subcategory;
	}

	public String getBookTitle() {
		return bookTitle;
	}

	public void setBookTitle(String bookTitle) {
		this.bookTitle = bookTitle;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getSequenceLarge() {
		return sequenceLarge;
	}

	public void setSequenceLarge(int sequenceLarge) {
		this.sequenceLarge = sequenceLarge;
	}

	public int getRecordId() {
		return RecordId;
	}

	public void setRecordId(int recordId) {
		RecordId = recordId;
	}

	public int getStudentId() {
		return StudentId;
	}

	public void setStudentId(int studentId) {
		StudentId = studentId;
	}

	public int getBookId() {
		return BookId;
	}

	public void setBookId(int bookId) {
		BookId = bookId;
	}

	public Date getStartDate() {
		return StartDate;
	}

	public void setStartDate(Date startDate) {
		StartDate = startDate;
	}

	public Date getEndDate() {
		return EndDate;
	}

	public void setEndDate(Date endDate) {
		EndDate = endDate;
	}

	public int getRep() {
		return Rep;
	}

	public void setRep(int rep) {
		Rep = rep;
	}

	public int getTest() {
		return Test;
	}

	public void setTest(int test) {
		Test = test;
	}

	public int getTestTime() {
		return TestTime;
	}

	public void setTestTime(int testTime) {
		TestTime = testTime;
	}

	public int getMistakes() {
		return Mistakes;
	}

	public void setMistakes(int mistakes) {
		Mistakes = mistakes;
	}
	
	public String getNotes() {
		return Notes;
	}
	
	public void setNotes(String notes) {
		Notes = notes;
	}

	@Override
	public String toString() {
		return "Record [RecordId=" + RecordId + ", StudentId=" + StudentId + ", BookId=" + BookId + ", startDate="
				+ StartDate + ", endDate=" + EndDate + ", Rep=" + Rep + ", Test=" + Test + ", TestTime=" + TestTime
				+ ", Mistakes=" + Mistakes + "]" + " Notes: " + Notes;
	}	
}
