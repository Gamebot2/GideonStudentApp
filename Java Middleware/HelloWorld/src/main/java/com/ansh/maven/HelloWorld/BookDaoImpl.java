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
		sql = "SELECT * FROM book";
		rowMapper = new BookRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
	//Retrieves a single book from the database given a specific ID number
	@Override
	public Book getBookById(int book_id) {
		sql = "SELECT * FROM book WHERE book_id = ?";
		rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		return jdbcTemplate.queryForObject(sql, rowMapper, book_id);
	}
	
	//Retrieves a single book from the database given information about its name
	@Override
	public Book getBookByName(String category, String subcategory, String title) {
		sql = "SELECT * FROM book WHERE category = ? AND subcategory = ? AND title = ?";
		rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		return jdbcTemplate.queryForObject(sql, rowMapper, category, subcategory, title);
	}
	
	//Returns a list of categories in the database
	@Override
	public List<String> getCategories() {
		sql = "SELECT DISTINCT category FROM book";
		return jdbcTemplate.queryForList(sql, String.class);
	}
	
	//Returns a list of subcategories for a given category in the database
	@Override
	public List<String> getSubcategories(String category) {
		sql = "SELECT DISTINCT subcategory FROM book WHERE category = ?";
		return jdbcTemplate.queryForList(sql, String.class, category);
	}
	
	//Returns a list of titles for a given subcategory in the database
	@Override
	public List<String> getTitles(String subcategory) {
		sql = "SELECT DISTINCT title FROM book WHERE subcategory = ?";
		return jdbcTemplate.queryForList(sql, String.class, subcategory);
	}
	
	//Returns all books between two sequenceLarge values within a certain category
	public List<Book> getBooksInRange(String category, int startSequence, int endSequence) {
		sql = "SELECT * FROM book WHERE UPPER(category) = UPPER(?) AND sequenceLarge > ? AND sequenceLarge <= ?";
		rowMapper = new BookRowMapper();
		return jdbcTemplate.query(sql, rowMapper, category, startSequence, endSequence);
	}
	

	//Returns whether or not a book exists by checking for its category and subcategory
	@Override
	public boolean bookExists(String category, String subcategory) {
		sql = "SELECT count(*) FROM book WHERE category = ? and subcategory = ?";
		int count = jdbcTemplate.queryForObject(sql, Integer.class, category, subcategory);

		return count > 0;
	}

	
	
}
