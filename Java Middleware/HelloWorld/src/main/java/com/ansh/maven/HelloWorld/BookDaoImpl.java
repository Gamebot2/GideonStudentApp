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
	
	private String sql;
	private RowMapper<Book> rowMapper;

	//Retrieves all books from the database
	@Override
	public List<Book> getAllBooks() {
		sql = "SELECT * FROM books";
		rowMapper = new BookRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
	//Retrieves a single book from the database given a specific ID number
	@Override
	public Book getBookById(int book_id) {
		sql = "SELECT * FROM books WHERE BookId = ?";
		rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		return jdbcTemplate.queryForObject(sql, rowMapper, book_id);
	}
	
	//Retrieves a single book from the database given information about its name
	@Override
	public Book getBookByName(String category, String subcategory, String title) {
		sql = "SELECT * FROM books WHERE Category = ? AND Subcategory = ? AND Title = ?";
		rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		return jdbcTemplate.queryForObject(sql, rowMapper, category, subcategory, title);
	}
	
	//Returns a list of categories in the database
	@Override
	public List<String> getCategories() {
		sql = "SELECT DISTINCT Category FROM books";
		return jdbcTemplate.queryForList(sql, String.class);
	}
	
	//Returns a list of subcategories for a given category in the database
	@Override
	public List<String> getSubcategories(String category) {
		sql = "SELECT DISTINCT Subcategory FROM books WHERE Category = ?";
		return jdbcTemplate.queryForList(sql, String.class, category);
	}
	
	//Returns a list of titles for a given subcategory in the database
	@Override
	public List<String> getTitles(String subcategory) {
		sql = "SELECT DISTINCT Title FROM books WHERE Subcategory = ?";
		return jdbcTemplate.queryForList(sql, String.class, subcategory);
	}
	
	//Returns all books between two sequenceLarge values within a certain category
	public List<Book> getBooksInRange(String category, int startSequence, int endSequence) {
		sql = "SELECT * FROM books WHERE UPPER(Category) = UPPER(?) AND SequenceLarge > ? AND SequenceLarge <= ?";
		rowMapper = new BookRowMapper();
		return jdbcTemplate.query(sql, rowMapper, category, startSequence, endSequence);
	}

	
	
}
