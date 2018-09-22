package com.ansh.maven.HelloWorld;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookServiceImpl implements BookService {
	
	@Autowired
	private BookDao bookDao;

	//Gets all books
	@Override
	public List<Book> getAllBooks() {
		return bookDao.getAllBooks();
	}

	//Gets specific book by ID
	@Override
	public Book getBookById(int book_id) {
		Book obj = bookDao.getBookById(book_id);
		return obj;
	}
	
	//Gets all categories in the database
	@Override
	public List<String> getCategories() {
		return bookDao.getCategories();
	}

	//Gets all subcategories in the database for a given category
	@Override
	public List<String> getSubcategories(String category) {
		return bookDao.getSubcategories(category);
	}

	//Gets all titles in the database for a given subcategory
	@Override
	public List<String> getTitles(String subcategory) {
		return bookDao.getTitles(subcategory);
	}

	//Gets all books between two sequenceLarge values within a certain category
	@Override
	public List<Book> getBooksInRange(String category, int startSequence, int endSequence) {
		return bookDao.getBooksInRange(category, startSequence, endSequence);
	}
	
	
	
}
