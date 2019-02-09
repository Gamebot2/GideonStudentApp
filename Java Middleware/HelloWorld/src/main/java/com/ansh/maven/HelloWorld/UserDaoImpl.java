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
	public User getLogIn(String user, String pass) {
		init();
		
		String sql = "SELECT COUNT(*) FROM " + title + " WHERE " + userColumn + " = ?";
		Integer getUser = jdbcTemplate.queryForObject(sql, Integer.class, user);
		if (getUser == null || getUser == 0)
			return null;
		
		sql = "SELECT " + termColumn + " FROM " + title + " WHERE " + userColumn + " = ?";
		int terminated = jdbcTemplate.queryForObject(sql, Integer.class, user);
		
		sql = "SELECT " + passColumn + " FROM " + title + " WHERE " + userColumn + " = ?";
		if (BCrypt.checkpw(pass, jdbcTemplate.queryForObject(sql, String.class, user)))
			return new User(user, terminated);
		else
			return null;
	}
	
	@Override
	public int terminateAccount(String username) {
		init();
		
		String sql = "DELETE FROM " + title + " WHERE " + userColumn + " = ?";
		return jdbcTemplate.update(sql, username);
	}

	void init() {
		if (inited) return;
		
		title = jdbcTemplate.queryForObject("SELECT Title FROM users_metadata", String.class);
		userColumn = jdbcTemplate.queryForObject("SELECT Username FROM users_metadata", String.class);
		passColumn = jdbcTemplate.queryForObject("SELECT PasswordHash FROM users_metadata", String.class);
		termColumn = jdbcTemplate.queryForObject("SELECT `Terminated` FROM users_metadata", String.class);
		inited = true;
	}
	
}
