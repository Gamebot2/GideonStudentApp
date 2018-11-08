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
	public Book getBookById(int bookId) {
		return bookDao.getBookById(bookId);
	}
	
	//Gets specific book by name
	@Override
	public Book getBookByName(String category, String subcategory, String title) {
		return bookDao.getBookByName(category, subcategory, title);
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

	//Gets all books, ordered in sequence, in a category
	@Override
	public List<Book> getBooksInCategory(String category) {
		return bookDao.getBooksInCategory(category);
	}
	
	
	
}
