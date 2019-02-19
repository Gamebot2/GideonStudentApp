package com.ansh.maven.HelloWorld;

import java.util.Date;

//Class used to manage data movement across multiple tables
public class Master {
	
	private int StudentId;
	private String Category;
	private String Subcategory;
	private String Title;
	private Date StartDate;
	private int Rep;
	private String Notes;
	

	public Master() {
		super();
	}
	
	public Master(int studentId, String category, String subcategory, String title, Date startDate, int rep, String notes) {
		super();
		StudentId = studentId;
		Category = category;
		Subcategory = subcategory;
		Title = title;
		StartDate = startDate;
		Rep = rep;
		Notes = notes;
	}

	public int getStudentId() {
		return StudentId;
	}
	
	public void setStudentId(int studentId) {
		StudentId = studentId;
	}
	
	public String getCategory() {
		return Category;
	}
	
	public void setCategory(String category) {
		Category = category;
	}
	
	public String getSubcategory() {
		return Subcategory;
	}
	
	public void setSubcategory(String subcategory) {
		Subcategory = subcategory;
	}
	
	public String getTitle() {
		return Title;
	}
	
	public void setTitle(String title) {
		Title = title;
	}
	
	public Date getStartDate() {
		return StartDate;
	}
	
	public void setStartDate(Date startDate) {
		StartDate = startDate;
	}
	
	
	public int getRep() {
		return Rep;
	}
	
	public void setRep(int rep) {
		Rep = rep;
	}

	public String getNotes() {
		return Notes;
	}

	public void setNotes(String notes) {
		Notes = notes;
	}


	
}
