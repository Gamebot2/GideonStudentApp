package com.ansh.maven.HelloWorld;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.ansh.maven.HelloWorld.Book;
import com.ansh.maven.HelloWorld.BookRowMapper;

@Transactional
@Repository
public class UserDaoImpl implements UserDao {
	
	boolean inited = false;
	String title;
	String userColumn;
	String passColumn;
	String termColumn;
	
	@Autowired
	@Qualifier("gideon")
	private JdbcTemplate jdbcTemplate;

	@Override
	public int getLogIn(String user, String pass) {
		init();
		
		String sql = "SELECT COUNT(*) FROM " + title + " WHERE " + userColumn + " = ?";
		Integer getUser = jdbcTemplate.queryForObject(sql, Integer.class, user);
		if (getUser == null || getUser == 0)
			return -1;
		
		sql = "SELECT " + passColumn + " FROM " + title + " WHERE " + userColumn + " = ?";
		if (BCrypt.checkpw(pass, jdbcTemplate.queryForObject(sql, String.class, user)))
			return 0;
		else
			return -1;
	}

	void init() {
		title = jdbcTemplate.queryForObject("SELECT Title FROM users_metadata", String.class);
		userColumn = jdbcTemplate.queryForObject("SELECT Username FROM users_metadata", String.class);
		passColumn = jdbcTemplate.queryForObject("SELECT PasswordHash FROM users_metadata", String.class);
		termColumn = jdbcTemplate.queryForObject("SELECT `Terminated` FROM users_metadata", String.class);
	}
	
}
