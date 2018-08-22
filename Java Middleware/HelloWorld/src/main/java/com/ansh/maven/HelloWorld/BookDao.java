package com.ansh.maven.HelloWorld;

import java.util.*;
import com.ansh.maven.HelloWorld.Book;

public interface BookDao {
	List<Book> getAllBooks();
	Book getBookById(int book_id);
	Book getBookByName(String category, String subcategory, String title);
	List<String> getCategories();
	List<String> getSubcategories(String category);
	List<String> getTitles(String subcategory);

	List<Book> getBooksInRange(String category, int startSequence, int endSequence);
	
	boolean bookExists(String category, String subcategory);
}
