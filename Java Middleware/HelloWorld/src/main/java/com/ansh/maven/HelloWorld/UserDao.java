package com.ansh.maven.HelloWorld;

public interface UserDao {
	User getLogIn(String user, String pass);
	boolean checkIfTerminated(String user);
	int terminateAccount(String username);
}
