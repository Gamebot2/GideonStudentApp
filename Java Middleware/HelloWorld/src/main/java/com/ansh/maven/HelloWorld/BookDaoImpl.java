package com.ansh.maven.HelloWorld;

import java.util.List;

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

	//Retrieves all books from the database
	@Override
	public List<Book> getAllBooks() {
		String sql = "SELECT * FROM books";
		RowMapper<Book> rowMapper = new BookRowMapper();
		return this.jdbcTemplate.query(sql, rowMapper);
	}
	
	//Retrieves a single book from the database given a specific ID number
	@Override
	public Book getBookById(int bookId) {
		String sql = "SELECT * FROM books WHERE BookId = ?";
		RowMapper<Book> rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		return jdbcTemplate.queryForObject(sql, rowMapper, bookId);
	}
	
	//Retrieves a single book from the database given information about its name
	@Override
	public Book getBookByName(String category, String subcategory, String title) {
		String sql = "SELECT * FROM books WHERE Category = ? AND Subcategory = ? AND Title = ?";
		RowMapper<Book> rowMapper = new BeanPropertyRowMapper<Book>(Book.class);
		return jdbcTemplate.queryForObject(sql, rowMapper, category, subcategory, title);
	}
	
	//Returns a list of categories in the database
	@Override
	public List<String> getCategories() {
		String sql = "SELECT DISTINCT Category FROM books";
		return jdbcTemplate.queryForList(sql, String.class);
	}
	
	//Returns a list of subcategories for a given category in the database
	@Override
	public List<String> getSubcategories(String category) {
		String sql = "SELECT DISTINCT Subcategory FROM books WHERE Category = ?";
		return jdbcTemplate.queryForList(sql, String.class, category);
	}
	
	//Returns a list of titles for a given subcategory in the database
	@Override
	public List<String> getTitles(String subcategory) {
		String sql = "SELECT DISTINCT Title FROM books WHERE Subcategory = ?";
		return jdbcTemplate.queryForList(sql, String.class, subcategory);
	}
	
	//Returns all books, ordered in sequence, in a category
	@Override
	public List<Book> getBooksInCategory(String category) {
		String sql = "SELECT * FROM books WHERE UPPER(Category) = UPPER(?) ORDER BY SequenceLarge";
		RowMapper<Book> rowMapper = new BookRowMapper();
		return jdbcTemplate.query(sql, rowMapper, category);
	}

	
	
}
