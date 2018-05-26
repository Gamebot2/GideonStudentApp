package com.ansh.maven.HelloWorld;

public class Book {
	
	private int book_id;
	private String subject;
	private String category;
	private String subcategory;
	private String title;
	private int gradeLevel;
	private int test;
	private int timeAllowed;
	private int mistakesAllowed;
	private int sequence;
	private int sequenceLarge;
	
	public Book() {
		super();
	}

	public Book(int book_id, String subject, String category, String subcategory, String title, int gradeLevel,
			int test, int timeAllowed, int mistakesAllowed, int sequence, int sequenceLarge) {
		super();
		this.book_id = book_id;
		this.subject = subject;
		this.category = category;
		this.subcategory = subcategory;
		this.title = title;
		this.gradeLevel = gradeLevel;
		this.test = test;
		this.timeAllowed = timeAllowed;
		this.mistakesAllowed = mistakesAllowed;
		this.sequence = sequence;
		this.sequenceLarge = sequenceLarge;
	}

	public int getBook_id() {
		return book_id;
	}

	public void setBook_id(int book_id) {
		this.book_id = book_id;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
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

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public int getGradeLevel() {
		return gradeLevel;
	}

	public void setGradeLevel(int gradeLevel) {
		this.gradeLevel = gradeLevel;
	}

	public int getTest() {
		return test;
	}

	public void setTest(int test) {
		this.test = test;
	}

	public int getTimeAllowed() {
		return timeAllowed;
	}

	public void setTimeAllowed(int timeAllowed) {
		this.timeAllowed = timeAllowed;
	}

	public int getMistakesAllowed() {
		return mistakesAllowed;
	}

	public void setMistakesAllowed(int mistakesAllowed) {
		this.mistakesAllowed = mistakesAllowed;
	}

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public int getSequenceLarge() {
		return sequenceLarge;
	}

	public void setSequenceLarge(int sequenceLarge) {
		this.sequenceLarge = sequenceLarge;
	}

	@Override
	public String toString() {
		return "Book [book_id=" + book_id + ", subject=" + subject + ", category=" + category + ", subcategory="
				+ subcategory + ", title=" + title + ", gradeLevel=" + gradeLevel + ", test=" + test + ", timeAllowed="
				+ timeAllowed + ", mistakesAllowed=" + mistakesAllowed + ", sequence=" + sequence + ", sequenceLarge="
				+ sequenceLarge + "]";
	}
	
	
	
	
}
