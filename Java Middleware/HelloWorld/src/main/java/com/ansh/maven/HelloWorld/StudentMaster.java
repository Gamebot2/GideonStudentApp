package com.ansh.maven.HelloWorld;

public class StudentMaster {
	private String Client;
	private String FirstName;
	private String LastName;
	private String Grade;
	private String Gender;
	
	
	
	public StudentMaster() {
		super();
	}
	
	public StudentMaster(String client, String grade, String gender) {
		super();
		Client = client;
		String[] names = client.split(" ");
		String firstName = names[0];
		String lastName = names[names.length-1];
		FirstName = firstName;
		LastName = lastName;
		Grade = grade;
		Gender = gender;
	}
	public String getClient() {
		return Client;
	}
	public void setClient(String client) {
		Client = client;
	}
	public String getFirstName() {
		return FirstName;
	}
	public void setFirstName(String firstName) {
		FirstName = firstName;
	}
	public String getLastName() {
		return LastName;
	}
	public void setLastName(String lastName) {
		LastName = lastName;
	}
	public String getGrade() {
		return Grade;
	}
	public void setGrade(String grade) {
		Grade = grade;
	}
	public String getGender() {
		return Gender;
	}
	public void setGender(String gender) {
		Gender = gender;
	}
	
	
	
}
