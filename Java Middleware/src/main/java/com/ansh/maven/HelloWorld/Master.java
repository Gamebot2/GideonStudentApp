package com.ansh.maven.HelloWorld;

import java.util.Date;

//Class used to manage data movement across multiple tables
public class Master {
	
	private String Client;
	private String category;
	private String subcategory;
	private String title;
	private Date startDate;
	private int testTime;
	private int mistakes;
	private int rep;
	

	public Master() {
		super();
	}
	
	public Master(String client, String category, String subcategory, String title, Date startDate, int testTime,
			int mistakes, int rep) {
		super();
		Client = client;
		this.category = category;
		this.subcategory = subcategory;
		this.title = title;
		this.startDate = startDate;
		this.testTime = testTime;
		this.mistakes = mistakes;
		this.rep = rep;
	}

	public String getClient() {
		return Client;
	}
	
	public void setClient(String client) {
		Client = client;
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
	
	public int getTestTime() {
		return testTime;
	}

	public void setTestTime(int testTime) {
		this.testTime = testTime;
	}

	public int getMistakes() {
		return mistakes;
	}

	public void setMistakes(int mistakes) {
		this.mistakes = mistakes;
	}
	
	public int getRep() {
		return rep;
	}
	
	public void setRep(int rep) {
		this.rep = rep;
	}


	
}
