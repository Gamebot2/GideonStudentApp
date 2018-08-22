package com.ansh.maven.HelloWorld;

import java.util.*;
import com.ansh.maven.HelloWorld.*;


public interface BookService {

	List<Book> getAllBooks();
	Book getBookById(int book_id);
	List<String> getCategories();
	List<String> getSubcategories(String category);
	List<String> getTitles(String subcategory);
	List<String> getDataSubcategories(int StudentId, String category);
	List<Book> getBooksInRange(String category, int startSequence, int endSequence);
}
