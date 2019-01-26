package com.ansh.maven.HelloWorld;

import java.util.*;


public interface UserService {
	int getLogIn(String user, String pass);
	int register(String user, String pass);
}
