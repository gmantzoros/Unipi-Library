//Toggle the user menu
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

//Function to show different content sections
function showContent(contentID) {
    // Hide all content sections
    document.getElementById('add-content').style.display = 'none';
    document.getElementById('search-content').style.display = 'none';
    document.getElementById('delete-content').style.display = 'none';

    // Show the selected content section
    document.getElementById(contentID).style.display = 'block';
}

//Add a new book functionality
document.getElementById('add-book-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const publication_date = document.getElementById('publication_date').value;
    const isbn = document.getElementById('isbn').value;
    const pages = document.getElementById('pages').value;
    const briefing = document.getElementById('briefing').value;

    // Send an AJAX request to your Flask route to add the book
    fetch('/add_book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `title=${title}&author=${author}&genre=${genre}&publication_date=${publication_date}&isbn=${isbn}&pages=${pages}&briefing=${briefing}`
    })
    .then(response => response.json())
    .then(data => {
        alert('Book added successfully!');
        // Clear the form after successful submission if needed
        document.getElementById('add-book-form').reset();
    })
    .catch(error => console.error('Error:', error));
});

//Delete book functionality
document.getElementById('delete-book-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const isbn = document.getElementById('delete-isbn').value;

    // Send an AJAX request to your Flask route to delete the book
    fetch('/delete_book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `isbn=${isbn}`
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        // Clear the form after successful submission if needed
        document.getElementById('delete-book-form').reset();
    })
    .catch(error => console.error('Error:', error));
});

//Show all books 
document.addEventListener('DOMContentLoaded', function() {
    // Make an AJAX request to get all books from your Flask route
    fetch('/get_all_books')
    .then(response => response.json())
    .then(data => {
        // Assuming data is a list of available books
        const bookList = document.getElementById('book-list');

        // Iterate through the list of books
        data.forEach(books => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            //add the new div
            let bookHtml = `
            <span class="title">Title: ${books.title}</span>
            <span class="author">Author: ${books.author}</span>
            <span class="genre">Genre: ${books.genre}</span>
            <span class="publication_date">Publication Date: ${books.publication_date}</span>
            <span class="isbn">ISBN: ${books.isbn}</span>
            <span class="pages">Pages: ${books.pages}</span>
            <span class="briefing">Briefing: ${books.briefing}</span>
            <span class="availability">Availability: ${books.availability}</span>
            `;
            if (!books.availability && books.renter) {
                bookHtml += `, 
                <span class="rented_by">Rented by: ${books.renter.email}</span>
                <span class="rent_date">Rent Date: ${books.renter.rent_date}</span>
                <span class="return_date">Return Date: ${books.renter.return_date}</span>
                `;
            }
            bookItem.innerHTML = bookHtml;
            bookList.appendChild(bookItem);
        });
    })
    .catch(error => console.error('Error fetching available books:', error));
});

//Handle the search functionality
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