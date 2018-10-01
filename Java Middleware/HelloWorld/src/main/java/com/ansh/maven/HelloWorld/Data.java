package com.ansh.maven.HelloWorld;

public class Data {
	
	private int DataId;
	private String Category;
	private int BookId;
	private String Grade;
	private int SequenceLarge;
	
	public Data() {
		super();
	}

	public Data(int dataId, String category, int bookId, String grade, int sequenceLarge) {
		super();
		DataId = dataId;
		Category = category;
		BookId = bookId;
		Grade = grade;
		SequenceLarge = sequenceLarge;
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

	public int getBookId() {
		return BookId;
	}

	public void setBookId(int bookId) {
		BookId = bookId;
	}
	
	public String getGrade() {
		return Grade;
	}

	public void setGrade(String grade) {
		Grade = grade;
	}
	
	public int getSequenceLarge() {
		return SequenceLarge;
	}
	
	public void setSequenceLarge(int sequenceLarge) {
		SequenceLarge = sequenceLarge;
	}

	@Override
	public String toString() {
		return "Int. Data [DataId=" + DataId + ", Category=" + Category + ", BookId=" + BookId + ", Grade=" + Grade + "]";
	}	
}
