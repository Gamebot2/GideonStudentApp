package com.ansh.maven.HelloWorld;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class BookRowMapper implements RowMapper<Book>{

	@Override
	public Book mapRow(ResultSet row, int rowNum) throws SQLException {
		// TODO Auto-generated method stub
		Book book = new Book();
		book.setBook_id(row.getInt("book_id"));
		book.setSubject(row.getString("Subject"));
		book.setCategory(row.getString("category"));
		book.setSubcategory(row.getString("subcategory"));
		book.setTitle(row.getString("title"));
		book.setGradeLevel(row.getInt("gradeLevel"));
		book.setTest(row.getInt("test"));
		book.setTimeAllowed(row.getInt("timeAllowed"));
		book.setMistakesAllowed(row.getInt("mistakesAllowed"));
		book.setSequence(row.getInt("sequence"));
		book.setSequenceLarge(row.getInt("sequenceLarge"));
		return book;
	}

}
