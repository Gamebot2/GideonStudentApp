package com.ansh.maven.HelloWorld;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class BookRowMapper implements RowMapper<Book>{

	@Override
	public Book mapRow(ResultSet row, int rowNum) throws SQLException {
		Book book = new Book();
		book.setBookId(row.getInt("BookId"));
		book.setSubject(row.getString("Subject"));
		book.setCategory(row.getString("Category"));
		book.setSubcategory(row.getString("Subcategory"));
		book.setTitle(row.getString("Title"));
		book.setGradeLevel(row.getInt("GradeLevel"));
		book.setTest(row.getInt("Test"));
		book.setTimeAllowed(row.getInt("TimeAllowed"));
		book.setMistakesAllowed(row.getInt("MistakesAllowed"));
		book.setSequenceName(row.getString("SequenceName"));
		book.setSequenceLength(row.getInt("SequenceLength"));
		book.setSequence(row.getInt("Sequence"));
		book.setSequenceLarge(row.getInt("SequenceLarge"));
		return book;
	}

}
