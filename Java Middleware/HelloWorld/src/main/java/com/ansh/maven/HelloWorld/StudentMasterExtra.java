package com.ansh.maven.HelloWorld;

public class StudentMasterExtra extends StudentMaster {
	
	private int studentId;
	private String email;
	private String phone;
	private String address;
	private String currentPasses;
	
	public StudentMasterExtra() {
		super();
	}
	
	public StudentMasterExtra(int id, String client, String email, String phone, String address, String grade, String gender, String currentPasses) {
		super(client, grade, gender);
		this.studentId = id;
		this.email = email;
		this.phone = phone;
		this.address = address;
		this.currentPasses = currentPasses;
	}

	public int getStudentId() {
		return studentId;
	}
	public void setStudentId(int id) {
		this.studentId = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCurrentPasses() {
		return currentPasses;
	}
	public void setCurrentPasses(String currentPasses) {
		this.currentPasses = currentPasses;
	}
	
	
	
	
}
