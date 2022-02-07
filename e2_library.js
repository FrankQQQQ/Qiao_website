/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/ 

/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/
const print = console.log;

/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();
	let book_name = e.target.querySelector("#newBookName").value;
	let book_author = e.target.querySelector("#newBookAuthor").value;
	let book_genre = e.target.querySelector("#newBookGenre").value;
	let this_book = new Book(book_name, book_author, book_genre);
	libraryBooks.push(this_book);   //Add book book to global array
	addBookToLibraryTable(this_book)  // Call addBookToLibraryTable properly to add book to the DOM

	
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();
	let book_id = e.target.querySelector("#loanBookId").value;
	let card_number = e.target.querySelector("#loanCardNum").value;	// Get correct book and patron
	let this_book = libraryBooks[book_id];
	let this_patron = patrons[card_number];

	libraryBooks[book_id].patron = this_patron;	// Add patron to the book's patron property

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(this_book);

	this_book.setLoanTime();
	// Start the book loan timer.
	

}

// Changes book patron information and calls removeBookFromPatronTable()
function returnBookToLibrary(e){
	e.preventDefault();
	if(e.target.classList.contains("return")){
		// check if return button was clicked, otherwise do nothing.
	//	e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
	let row_elements = e.target.parentElement.parentElement.getElementsByTagName("td");
	let this_book_id = parseInt(row_elements[0].innerHTML); //get the correct book id.
	let book = libraryBooks[this_book_id];
	
	removeBookFromPatronTable(book);
	libraryBooks[this_book_id].patron = null;
	

	//libraryBooks[this_book_id].patron = null; 	// Change the book object to have a patron of 'null'
		
	}

	// Call removeBookFromPatronTable()


	// Change the book object to have a patron of 'null'


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();
	let patron_name = e.target.querySelector("#newPatronName").value;
	let this_patron = new Patron(patron_name)
	patrons.push(this_patron);	// Add a new patron to global array
	addNewPatronEntry(this_patron);// Call addNewPatronEntry() to add patron to the DOM



}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();
	let book_id = e.target.querySelector("#bookInfoId").value;
	let this_book = libraryBooks[book_id];// Get correct book
	displayBookInfo(this_book);// Call displayBookInfo()	

}







/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	let book_table = document.querySelector("#bookTable");
	let this_book = document.createElement("tr");
	
	let book_id = document.createTextNode(book.bookId.toString());

	let book_id_container = document.createElement("td");
	book_id_container.appendChild(book_id);

	let book_title = document.createTextNode(book.title);
	let book_title_container = document.createElement("td");
	let book_title_subcontainer = document.createElement("strong");
	book_title_subcontainer.appendChild(book_title);
	book_title_container.appendChild(book_title_subcontainer);

	let book_patron_card_number_container = document.createElement("td");


	this_book.appendChild(book_id_container);
	this_book.appendChild(book_title_container);
	this_book.appendChild(book_patron_card_number_container);

	book_table.appendChild(this_book);

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	let book_id_subcontainer = document.createElement("span");
	book_id_subcontainer.appendChild(document.createTextNode(book.bookId));
	let book_id_container = document.createElement("p");
	book_id_container.appendChild(document.createTextNode("Book Id: "));
	book_id_container.appendChild(book_id_subcontainer);					//book id

	let book_title_subcontainer = document.createElement("span");
	book_title_subcontainer.appendChild(document.createTextNode(book.title));
	let book_title_container = document.createElement("p");
	book_title_container.appendChild(document.createTextNode("Title: "));
	book_title_container.appendChild(book_title_subcontainer);				//book title

	let book_author_subcontainer = document.createElement("span");
	book_author_subcontainer.appendChild(document.createTextNode(book.author));
	let book_author_container = document.createElement("p");
	book_author_container.appendChild(document.createTextNode("Author: "));
	book_author_container.appendChild(book_author_subcontainer);			//book author

	let book_genre_subcontainer = document.createElement("span");
	book_genre_subcontainer.appendChild(document.createTextNode(book.genre));
	let book_genre_container = document.createElement("p");
	book_genre_container.appendChild(document.createTextNode("Genre: "));
	book_genre_container.appendChild(book_genre_subcontainer);			//book 


	let book_patronID_subcontainer = document.createElement("span");
	if (book.patron != null){
		book_patronID_subcontainer.appendChild(document.createTextNode(book.patron.cardNumber));
	}
	else{
		book_patronID_subcontainer.appendChild(document.createTextNode("N/A"));
	}
	let book_patronID_container = document.createElement("p");
	book_patronID_container.appendChild(document.createTextNode("Currently loaned out to: "));
	book_patronID_container.appendChild(book_patronID_subcontainer);	//patron ID


	let book_info = document.createElement("div");
	book_info.id = "bookInfo";
	book_info.appendChild(book_id_container);
	book_info.appendChild(book_title_container);
	book_info.appendChild(book_author_container);
	book_info.appendChild(book_genre_container);
	book_info.appendChild(book_patronID_container);
	document.getElementById("bookInfo").replaceWith(book_info); //replace with new information

}



// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	let book_id_text = document.createTextNode(book.bookId);
	let book_id_container = document.createElement("td");
	book_id_container.appendChild(book_id_text);
	
	let name_subcontainer = document.createElement("strong");
	name_subcontainer.appendChild(document.createTextNode(book.title));
	let name_container = document.createElement("td");
	name_container.appendChild(name_subcontainer);

	let state_subcontainer = document.createElement("span");
	state_subcontainer.className = "green";
	state_subcontainer.appendChild(document.createTextNode("Within due date"));
	let state_container = document.createElement("td");
	state_container.appendChild(state_subcontainer);

	let return_subcontainer = document.createElement("button");
	return_subcontainer.className = "return";
	return_subcontainer.appendChild(document.createTextNode("return"));
	let return_container = document.createElement("td");
	return_container.appendChild(return_subcontainer);

	let book_container = document.createElement("tr");
	book_container.appendChild(book_id_container);
	book_container.appendChild(name_container);
	book_container.appendChild(state_container);
	book_container.appendChild(return_container);	//finish new the

	let all_patrons = document.getElementsByClassName("patron") 
	let student = (all_patrons[book.patron.cardNumber]);//find the student!
	let student_loan_table = student.getElementsByClassName("patronLoansTable")[0];
	student_loan_table.appendChild(book_container); //append into the list.



	//Begin to modify book library DOM.
	let book_table = document.querySelector("#bookTable").getElementsByTagName("tr");

	let need_modify = book_table[book.bookId + 1];
	let modify_to = document.createTextNode(book.patron.cardNumber);
	need_modify.getElementsByTagName("td")[2].appendChild(modify_to);//Successfully modify patron card number in book libraary DOM.
	


	
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status, and Return).
function addNewPatronEntry(patron) {
	let book_id = document.createTextNode("BookID");//begin <table> tag
	let title = document.createTextNode("Title");
	let status = document.createTextNode("Status");
	let return_text = document.createTextNode("Return");

	let book_id_container = document.createElement("th");
	book_id_container.appendChild(book_id);

	let title_container = document.createElement("th");
	title_container.appendChild(title);

	let status_container = document.createElement("th");
	status_container.appendChild(status);

	let return_container = document.createElement("th");
	return_container.appendChild(return_text);

	let tr = document.createElement("tr");
	tr.appendChild(book_id_container);
	tr.appendChild(title_container);
	tr.appendChild(status_container);
	tr.appendChild(return_container);

	let tbody = document.createElement("tbody");
	tbody.appendChild(tr);

	let table_container = document.createElement("table");
	table_container.className = "patronLoansTable";
	table_container.appendChild(tbody);      //finally create everything in <table> tag

	let books_on_loan_text = document.createTextNode("Books on loan: ");
	let book_on_loan_container = document.createElement("h4");
	book_on_loan_container.appendChild(books_on_loan_text);  //books on loan <h4>

	let card_number_text = document.createTextNode(patron.cardNumber);
	let card_number_subcontainer = document.createElement("span");
	card_number_subcontainer.className = "bold";
	card_number_subcontainer.appendChild(card_number_text);
	let outer_text = document.createTextNode("Card Number: ");
	let card_number_container = document.createElement("p");
	card_number_container.appendChild(outer_text);
	card_number_container.appendChild(card_number_subcontainer); // card number <p>

	let name_text = document.createTextNode(patron.name);
	let name_subcontainer =document.createElement("span");
	name_subcontainer.className = "bold";
	name_subcontainer.appendChild(name_text);
	let outer_text2 = document.createTextNode("Name: ");
	let name_container = document.createElement("p");
	name_container.appendChild(outer_text2);
	name_container.appendChild(name_subcontainer); //name <p>

	let this_patron = document.createElement("div");
	this_patron.className = "patron";
	this_patron.appendChild(name_container);
	this_patron.appendChild(card_number_container);
	this_patron.appendChild(book_on_loan_container);
	this_patron.appendChild(table_container);
	
	let all_patrons = document.querySelector("#patrons");
	all_patrons.appendChild(this_patron);






	// Add code here

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	//print(book.patron.cardNumber)
	//print(book.bookId)
	let student = document.getElementsByClassName("patron")[book.patron.cardNumber];//find the student.
	let book_table = student.getElementsByClassName("patronLoansTable")[0];
	let book_list = book_table.getElementsByTagName("tr")
	for (let i = 1; i < book_list.length; i++){
		let this_id = (parseInt(book_list[i].getElementsByTagName("td")[0].innerHTML));

		if(this_id == book.bookId){  //Check if this id is equal to the book id we want to remove.
			book_list[i].parentElement.removeChild(book_list[i]) //remove!
		}
	}

	//now begin to remove book library's patron card number.

	let book_library = document.getElementById("bookTable");
	let removed_row = book_library.getElementsByTagName("tr")[book.bookId + 1]
	removed_row.getElementsByTagName("td")[2].innerHTML = null; //delete
	

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	
	let state_subcontainer = document.createElement("span");
	state_subcontainer.className = "red";
	state_subcontainer.appendChild(document.createTextNode("Overdue"));
	let state_container = document.createElement("td");
	state_container.appendChild(state_subcontainer);//create over due node
	

	let all_patrons = document.getElementsByClassName("patron") 
	let student = (all_patrons[book.patron.cardNumber]);//find the student!
	let student_loan_table = student.getElementsByClassName("patronLoansTable")[0];
	let book_specify_row = student_loan_table.getElementsByTagName("tr")
	for(let i = 0; i < book_specify_row.length; i++){
		let row = book_specify_row[i].getElementsByTagName("td");
		if(row.length != 0 && row[0].innerHTML == book.bookId.toString()){
			row[2].replaceWith(state_container);
			//we found this book. change its state to overdue

		}
	}
	// Add code here
	

}

