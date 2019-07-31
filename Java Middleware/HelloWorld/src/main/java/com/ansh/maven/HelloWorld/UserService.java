package com.ansh.maven.HelloWorld;

public interface UserService {
	User getLogIn(String user, String pass);
	boolean checkIfTerminated(String user);
	int terminateAccount(String username);
}
