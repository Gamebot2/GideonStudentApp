package com.ansh.maven.HelloWorld;

import java.util.*;


public interface BookService {
	List<Book> getAllBooks();
	Book getBookById(int bookId);
	Book getBookByName(String category, String subcategory, String title);
	List<String> getCategories();
	List<String> getSubcategories(String category);
	List<String> getTitles(String subcategory);
	List<Book> getBooksInCategory(String category);
	List<Book> getBooksInSubcategory(String category, String subcategory);
}
