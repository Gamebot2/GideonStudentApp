package com.ansh.maven.HelloWorld;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.aspectj.weaver.reflect.ReflectionBasedResolvedMemberImpl;
import org.springframework.jdbc.core.RowMapper;

public class DataRowMapper implements RowMapper<Data>{

	@Override
	public Data mapRow(ResultSet row, int rowNum) throws SQLException {
		Data data = new Data();
		data.setDataId(row.getInt("DataId"));
		data.setCategory(row.getString("Category"));
		data.setMonth(row.getInt("Month"));
		data.setBookId(row.getInt("BookId"));
		return data;
	}
	
}
