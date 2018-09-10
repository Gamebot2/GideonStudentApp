package com.ansh.maven.HelloWorld;

import java.util.*;

public class Data {
	
	private int DataId;
	private String Category;
	private int Month;
	private int BookId;
	
	
	public Data() {
		super();
	}

	public Data(int dataId, String category, int month, int bookId) {
		super();
		DataId = dataId;
		Category = category;
		Month = month;
		BookId = bookId;
	}
	
	public int getDataId() {
		return DataId;
	}

	public void setDataId(int dataId) {
		DataId = dataId;
	}

	public String getCategory() {
		return Category;
	}

	public void setCategory(String category) {
		Category = category;
	}

	public int getMonth() {
		return Month;
	}

	public void setMonth(int month) {
		Month = month;
	}

	public int getBookId() {
		return BookId;
	}

	public void setBookId(int bookId) {
		BookId = bookId;
	}

	@Override
	public String toString() {
		return "Int. Data [DataId=" + DataId + ", Category=" + Category + ", Month=" + Month + ", BookId=" + BookId + "]";
	}	
}
