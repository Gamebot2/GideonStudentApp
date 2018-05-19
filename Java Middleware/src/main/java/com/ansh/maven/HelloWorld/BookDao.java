package com.ansh.maven.HelloWorld;

import java.util.*;
import com.ansh.maven.HelloWorld.Book;

public interface BookDao {
	List<Book> getAllBooks();
	Book getBookById(int book_id);
	boolean bookExists(String category, String subcategory);
}
