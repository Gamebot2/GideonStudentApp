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

	//Gets all subcategories in the database for a given category
	@Override
	public List<String> getSubcategories(String category) {
		// TODO Auto-generated method stub
		List<Book> midList = bookDao.getAllBooks();
		List<String> subcategories = new ArrayList<String>();
		for(Book b: midList) {
			if(!subcategories.contains(b.getSubcategory()) && b.getCategory().equals(category)) {
				subcategories.add(b.getSubcategory());
			}
		}
		return subcategories;
	}

	//Gets all titles in the database for a given subcategory
	@Override
	public List<String> getTitles(String subcategory) {
		// TODO Auto-generated method stub
		List<Book> midList = bookDao.getAllBooks();
		List<String> titles = new ArrayList<String>();
		for(Book b: midList) {
			if(!titles.contains(b.getTitle()) && b.getSubcategory().equals(subcategory)) {
				titles.add(b.getTitle());
			}
		}
		return titles;
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
		
		List<Book> bookList = bookDao.getAllBooks();
		List<Book> returnList = new ArrayList<Book>();
		for(int i = 0; i < bookList.size(); i++) {
			Book b = bookList.get(i);
			if(b.getCategory().equalsIgnoreCase(category)) {
				if (b.getSequenceLarge() > startSequence && b.getSequenceLarge() <= endSequence) {
					returnList.add(b);
				}
			}
		}
		return returnList;
	}
	
	
	
}
