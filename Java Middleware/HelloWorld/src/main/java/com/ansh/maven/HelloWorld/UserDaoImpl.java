package com.ansh.maven.HelloWorld;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.ansh.maven.HelloWorld.Book;
import com.ansh.maven.HelloWorld.BookRowMapper;

@Transactional
@Repository
public class UserDaoImpl implements UserDao {
	
	@Autowired
	@Qualifier("gideon")
	private JdbcTemplate jdbcTemplate;

	@Override
	public int getLogIn(String user, String pass) {
		if (user.equals("Ansh") && pass.equals("Jain"))
			return 0;
		else
			return -1;
	}

	@Override
	public int register(String user, String pass) {
		// TODO Auto-generated method stub
		return 0;
	}

	
	
}
