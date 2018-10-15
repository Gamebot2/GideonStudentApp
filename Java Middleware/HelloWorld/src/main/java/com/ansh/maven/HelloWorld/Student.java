package com.ansh.maven.HelloWorld;

import java.util.*;

public class Student {
	
	private int StudentId;
	private String Client;
	private String Email;
	private String Phone;
	private String Address;
	private String CurrentPasses;
	private String PrimaryStaffMember;
	private String FirstName;
	private String MiddleName;
	private String LastName;
	private String Grade;
	private String Gender;
	private int ClientId;
	private Date LastUsed;
	
	public Student() {
		super();
	}

	public Student(int studentId, String client, String email, String phone, String address, String currentPasses, String primaryStaffMember,
			String firstName, String middleName, String lastName, String grade, String gender, int clientId, Date lastUsed) {
		super();
		StudentId = studentId;
		Client = client;
		Email = email;
		Phone = phone;
		Address = address;
		CurrentPasses = currentPasses;
		PrimaryStaffMember = primaryStaffMember;
		FirstName = firstName;
		MiddleName = middleName;
		LastName = lastName;
		Grade = grade;
		Gender = gender;
		ClientId = clientId;
		LastUsed = lastUsed;
	}

	public int getStudentId() {
		return StudentId;
	}

	public void setStudentId(int studentId) {
		StudentId = studentId;
	}

	public String getClient() {
		return Client;
	}

	public void setClient(String client) {
		Client = client;
	}

	public String getEmail() {
		return Email;
	}

	public void setEmail(String email) {
		Email = email;
	}
	
	public String getPhone() {
		return Phone;
	}
	
	public void setPhone(String phone) {
		Phone = phone;
	}
	
	public String getAddress() {
		return Address;
	}
	
	public void setAddress(String address) {
		Address = address;
	}

	public String getCurrentPasses() {
		return CurrentPasses;
	}

	public void setCurrentPasses(String currentPasses) {
		CurrentPasses = currentPasses;
	}

	public String getPrimaryStaffMember() {
		return PrimaryStaffMember;
	}

	public void setPrimaryStaffMember(String primaryStaffMember) {
		PrimaryStaffMember = primaryStaffMember;
	}

	public String getFirstName() {
		return FirstName;
	}

	public void setFirstName(String firstName) {
		FirstName = firstName;
	}

	public String getMiddleName() {
		return MiddleName;
	}

	public void setMiddleName(String middleName) {
		MiddleName = middleName;
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

	public int getClientId() {
		return ClientId;
	}

	public void setClientId(int clientId) {
		ClientId = clientId;
	}
	
	public Date getLastUsed() {
		return LastUsed;
	}

	public void setLastUsed(Date lastUsed) {
		LastUsed = lastUsed;
	}

	@Override
	public String toString() {
		return "Student [StudentId=" + StudentId + ", Client=" + Client + ", Email=" + Email + ", Phone=" + Phone +
				", Address=" + Address + ", CurrentPasses=" + CurrentPasses + ", PrimaryStaffMember=" + PrimaryStaffMember +
				", FirstName=" + FirstName + ", MiddleName=" + MiddleName + ", LastName=" + LastName + ", Grade=" + Grade +
				", Gender=" + Gender + ", ClientId=" + ClientId + "]";
	}
	
}
