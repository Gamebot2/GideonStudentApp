package com.ansh.maven.HelloWorld;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookServiceImpl implements BookService {
	
	@Autowired
	private BookDao bookDao;
	
	@Autowired
	private RecordDao recordDao;

	//Gets all books
	@Override
	public List<Book> getAllBooks() {
		// TODO Auto-generated method stub
		return bookDao.getAllBooks();
	}

	//Gets specific book by ID
	@Override
	public Book getBookById(int book_id) {
		// TODO Auto-generated method stub
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
		// TODO Auto-generated method stub
		return bookDao.getSubcategories(category);
	}

	//Gets all titles in the database for a given subcategory
	@Override
	public List<String> getTitles(String subcategory) {
		// TODO Auto-generated method stub
		return bookDao.getTitles(subcategory);
	}
	
	//Gets all subcategories within a certain student's data that actually contain values in the record database
	@Override
	public List<String> getDataSubcategories(int studentId, String category) {
		List<Record> midList = recordDao.getAllRecordsById(studentId, category);
		List<String> subcategories = new ArrayList<String>();
		for(Record r: midList) {
			if(!subcategories.contains(r.getSubcategory())) {
				subcategories.add(r.getSubcategory());
			}
		}
		return subcategories;
		
	}

	//Gets all books between two sequenceLarge values within a certain category
	@Override
	public List<Book> getBooksInRange(String category, int startSequence, int endSequence) {
		return bookDao.getBooksInRange(category, startSequence, endSequence);
	}
	
	
	
}
