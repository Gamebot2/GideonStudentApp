package com.ansh.maven.HelloWorld;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

public class DataRowMapper implements RowMapper<Data>{

	@Override
	public Data mapRow(ResultSet row, int rowNum) throws SQLException {
		Data data = new Data();
		data.setDataId(row.getInt("DataId"));
		data.setCategory(row.getString("Category"));
		data.setBookId(row.getInt("BookId"));
		data.setGrade(row.getString("Grade"));
		data.setSequenceLarge(row.getInt("SequenceLarge"));
		return data;
	}
	
}
