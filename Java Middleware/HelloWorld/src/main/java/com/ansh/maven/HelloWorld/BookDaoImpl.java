package com.ansh.maven.HelloWorld;

import java.util.List;

import org.hibernate.hql.internal.ast.tree.AbstractRestrictableStatement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.ansh.maven.HelloWorld.Book;
import com.ansh.maven.HelloWorld.BookRowMapper;

@Transactional
@Repository
public class BookDaoImpl implements BookDao {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public List<Book> getAllBooks() {
		// TODO Auto-generated method stub
		String sql = "SELECT * FROM book";
		RowMapper<Book> rowMapper = new BookRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}

	@Override
	public Book getBookById(int book_id) {
		// TODO Auto-generated method stub
		String sql = "SELECT * FROM book WHERE book_id = ?";
		RowMapper<Book> rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		Book book = jdbcTemplate.queryForObject(sql, rowMapper, book_id);
		return book;
	}

	@Override
	public boolean bookExists(String category, String subcategory) {
		// TODO Auto-generated method stub
		String sql = "SELECT count(*) FROM book WHERE category = ? and subcategory = ?";
		int count = jdbcTemplate.queryForObject(sql, Integer.class, category, subcategory);
		if(count == 0) {
			return false;
		} else {
			return true;
		}
	}

	
	
}
