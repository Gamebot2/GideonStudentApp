package com.ansh.maven.HelloWorld;

public class Data {
	
	private int DataId;
	private String Category;
	private int Month;
	private int BookId;
	private int SequenceLarge;
	
	public Data() {
		super();
	}

	public Data(int dataId, String category, int month, int bookId, int sequenceLarge) {
		super();
		DataId = dataId;
		Category = category;
		Month = month;
		BookId = bookId;
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
	
	public int getSequenceLarge() {
		return SequenceLarge;
	}
	
	public void setSequenceLarge(int sequenceLarge) {
		SequenceLarge = sequenceLarge;
	}

	@Override
	public String toString() {
		return "Int. Data [DataId=" + DataId + ", Category=" + Category + ", Month=" + Month + ", BookId=" + BookId + "]";
	}	
}
