package com.ansh.maven.HelloWorld;

public class User {
	
	private String Username;
	private int Terminated;
	
	public User() {
		super();
	}

	public User(String username, int terminated) {
		super();
		Username = username;
		Terminated = terminated;
	}
	
	public String getUsername() {
		return Username;
	}

	public void setUsername(String username) {
		Username = username;
	}

	public int getTerminated() {
		return Terminated;
	}

	public void setTerminated(int terminated) {
		Terminated = terminated;
	}

	@Override
	public String toString() {
		return "User [Username=" + Username + ", Terminated=" + Terminated + "]";
	}	
}
