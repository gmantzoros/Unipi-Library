    // JavaScript to toggle the user menu
    document.getElementById("user-menu-toggle").addEventListener("click", function(e) {
        e.preventDefault();
        document.getElementById("user-menu").classList.toggle("show");
    });

    // Close the user menu when clicking outside of it
    window.addEventListener("click", function(e) {
        if (!e.target.matches("#user-menu-toggle")) {
            var userMenu = document.getElementById("user-menu");
            if (userMenu.classList.contains("show")) {
                userMenu.classList.remove("show");
            }
        }
    });

    //Delete user confirmation window
    document.getElementById("delete-user").addEventListener("click", function(e) {
        console.log("Clicked delete account button");
        e.preventDefault();
        if (confirm("Are you sure you want to delete your account?")) {
            window.location.href = "/delete-account";
        }
    });

    //Function to show different content sections
    function showContent(contentID) {
        // Hide all content sections
        document.getElementById('home-content').style.display = 'none';
        document.getElementById('rent-content').style.display = 'none';
        document.getElementById('return-content').style.display = 'none';
    
        // Show the selected content section
        document.getElementById(contentID).style.display = 'block';
    }

    //Show the available books
    document.addEventListener('DOMContentLoaded', function() {

        //show rented books in return page
        displayRentedBooks();

        //Mark the selected books for rent
        const selectedBooks = [];
        document.getElementById('book-list').addEventListener('click', function(event) {
            if (event.target && event.target.type === 'checkbox') {
                const selectedBook = event.target;
                const bookItem = selectedBook.closest('.book-item');
                const bookTitle = bookItem.querySelector('.title').textContent.trim().replace('Title: ', '');
                const bookAuthor = bookItem.querySelector('.author').textContent.trim().replace('Author: ', '');
                const bookISBN = bookItem.querySelector('.isbn').textContent.trim().replace('ISBN: ', '');
    
                if (selectedBook.checked) {
                    selectedBooks.push({ title: bookTitle, author: bookAuthor, isbn: bookISBN });
                } else {
                    const index = selectedBooks.findIndex(book => book.isbn === bookISBN);
                    if (index !== -1) {
                        selectedBooks.splice(index, 1);
                    }
                }
            }
        });
        //Mark the selected books for return 
        const selectedBooks2 = [];
        document.getElementById('rented-books').addEventListener('click', function(event) {
            if (event.target && event.target.type === 'checkbox') {
                const selectedBook = event.target;
                const bookItem = selectedBook.closest('.rented-book-item');
                const bookISBN = bookItem.querySelector('.isbn').textContent.trim().replace('ISBN: ', '');
    
                if (selectedBook.checked) {
                    selectedBooks2.push({ isbn: bookISBN });
                } else {
                    const index = selectedBooks2.findIndex(book => book.isbn === bookISBN);
                    if (index !== -1) {
                        selectedBooks2.splice(index, 1);
                    }
                }
            }
        });
        
        //Rent the books
        document.getElementById('rent-button').addEventListener('click', function() {
            selectedBooks.forEach(book => {
                // Send an AJAX request to your Flask route to rent the book
                fetch('/rent_book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `title=${book.title}&author=${book.author}&isbn=${book.isbn}`
                })
                .then(response => response.json())
                .then(data => {
                    location.reload();
                    alert('Rented Successfully!');
                })
                .catch(error => console.error('Error:', error));
            });
        });

        //Return Books
        document.getElementById('return-button').addEventListener('click', function() {
            selectedBooks2.forEach(book => {
                // Send an AJAX request to your Flask route to return the book
                fetch('/return_book', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `isbn=${book.isbn}`
                })
                .then(response => response.json())
                .then(data => {
                    location.reload();
                    alert('Returned Successfully!');
                })
                .catch(error => console.error('Error:', error));
            });
        });
        
        // Make an AJAX request to get available books from your Flask route
        fetch('/get_available_books')
            .then(response => response.json())
            .then(data => {
                // Assuming data is a list of available books
                const bookList = document.getElementById('book-list');
    
                // Iterate through the list of books
                data.forEach(books => {
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    //add the new div
                    bookItem.innerHTML = `
                    <input type="checkbox">
                    <span class="title">Title: ${books.title}</span>
                    <span class="author">Author: ${books.author}</span>
                    <span class="genre">Genre: ${books.genre}</span>
                    <span class="publication_date">Publication Date: ${books.publication_date}</span>
                    <span class="isbn">ISBN: ${books.isbn}</span>
                    <span class="pages">Pages: ${books.pages}</span>
                    <span class="briefing">Briefing: ${books.briefing}</span> 
                    `;
                    bookList.appendChild(bookItem);
                });
            })
            .catch(error => console.error('Error fetching available books:', error));
    });

    //handle the search bar
    document.getElementById('search-button').addEventListener('click', function() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const searchCriteria = document.getElementById('search-criteria').value;
        const bookItems = document.getElementsByClassName('book-item');
    
        for (let i = 0; i < bookItems.length; i++) {
            const bookItem = bookItems[i];
            const bookInfo = bookItem.innerText.toLowerCase();
    
            if (searchCriteria === 'all') {
                if (bookInfo.includes(searchInput)) {
                    bookItem.style.display = 'block';
                } else {
                    bookItem.style.display = 'none';
                }
            } else {
                const searchCategory = bookItem.querySelector(`span.${searchCriteria}`).innerText.toLowerCase();
    
                if (searchCategory.includes(searchInput)) {
                    bookItem.style.display = 'block';
                } else {
                    bookItem.style.display = 'none';
                }
            }
        }
    });

    function displayRentedBooks() { //show rented books
        fetch('/get_rented_books')
            .then(response => response.json())
            .then(data => {
                const rentedBooksContainer = document.getElementById('rented-books');
                rentedBooksContainer.innerHTML = '';
    
                data.forEach(book => {
                    const rentedBookItem = document.createElement('div');
                    rentedBookItem.classList.add('rented-book-item');
                    rentedBookItem.innerHTML = `
                    <input type="checkbox">
                    <span class="title">Title: ${book.title}</span>
                    <span class="author">Author: ${book.author}</span>
                    <span class="isbn">ISBN: ${book.isbn}</span>
                    <span class="rent-date">Rent Date: ${book.rent_date}</span>
                    <span class="return-date">Return Date: ${book.return_date}</span>
                    `;
                    rentedBooksContainer.appendChild(rentedBookItem);
                });
            })
            .catch(error => console.error('Error fetching rented books:', error));
    }
    
    //Handle the search bar functionality
   document.getElementById('search-button').addEventListener('click', function() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const searchCriteria = document.getElementById('search-criteria').value;
        const bookItems = document.getElementsByClassName('book-item');
    
        for (let i = 0; i < bookItems.length; i++) {
            const bookItem = bookItems[i];
            const bookInfo = bookItem.innerText.toLowerCase();
    
            if (searchCriteria === 'all') {
                if (bookInfo.includes(searchInput)) {
                    bookItem.style.display = 'block';
                } else {
                    bookItem.style.display = 'none';
                }
            } else {
                const searchCategory = bookItem.querySelector(`span.${searchCriteria}`).innerText.toLowerCase();
    
                if (searchCategory.includes(searchInput)) {
                    bookItem.style.display = 'block';
                } else {
                    bookItem.style.display = 'none';
                }
            }
        }
    }); 
