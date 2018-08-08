package com.ansh.maven.HelloWorld;

import java.util.Date;

//Class used to manage data movement across multiple tables
public class Master {
	
	private String id;
	private String category;
	private String subcategory;
	private String title;
	private Date startDate;
	private int rep;
	

	public Master() {
		super();
	}
	
	public Master(String id, String category, String subcategory, String title, Date startDate, int rep) {
		super();
		this.id = id;
		this.category = category;
		this.subcategory = subcategory;
		this.title = title;
		this.startDate = startDate;
		this.rep = rep;
	}

	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
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
	
	public Date getStartDate() {
		return startDate;
	}
	
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	
	
	public int getRep() {
		return rep;
	}
	
	public void setRep(int rep) {
		this.rep = rep;
	}


	
}
