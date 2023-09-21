from flask import Flask, render_template, request, redirect, session, jsonify
from flask_session import Session
from pymongo import MongoClient
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
client=MongoClient("mongodb://localhost:27017/")
db = client["UnipiLibrary"]

@app.route('/', methods=['GET', 'POST'])
def login_register():
    if request.method == 'POST':
        email = request.form['email'] #Gets Login Info
        password = request.form['password']
        action = request.form['action']

        if action=='Register':
            name = request.form['name'] #Gets additional register info
            surname = request.form['surname']
            dateOfBirth = request.form['dateOfBirth']
            #Check if email already exists
            existing_user = db.users.find_one({'email':email})

            if existing_user:
                return redirect('/?alert=Email Already Exists Try Again!')

            #If email doesn't exist, proceed with registration
            db.users.insert_one({'name':name, 'surname':surname, 'email':email, 'dateOfBirth':dateOfBirth, 'password':password})

            return redirect('/?alert=Registration successful!')  # Redirect to login page after successful registration
        
        elif action == 'Login':
            if email=='admin@unipi.gr' and password =='admin':
                session['email']=email
                return redirect('/admin') #Redirect to admin page
            user = db.users.find_one({'email': email, 'password': password})
            if user:
                session['email']=email
                return redirect('/main') #Redirect to main page after login
            else:
                return redirect('/?alert=Invalid Email or Password!')

    return render_template('index.html')

@app.route('/main')
def main():
    if 'email' in session:
        email = session['email']
        # Fetch user information based on the email from the session
        user = db.users.find_one({'email': email})
        return render_template('main.html', user=user)
    else:
        return redirect('/')
    
@app.route('/logout')
def logout():
    #Clear session data
    session.clear()
    #Redirect to login/register page
    return redirect('/')

@app.route('/delete-account', methods=['GET'])
def delete_account():
    if 'email' in session:
        user_email = session['email']
        #Remove user from the database
        db.users.delete_one({'email': user_email})
        #Clear session data
        session.clear()
    #Redirect to login/register page
    return redirect('/')

@app.route('/get_available_books', methods=['GET']) #get availability=true books
def get_available_books():
    available_books = list(db.books.find({'availability': True}))
    clean_books = [{'title': book['title'], 'author': book['author'], 'genre': book['genre'], 'publication_date': book['publication_date'], 'isbn': book['isbn'], 'pages':book['pages'], 'briefing': book['briefing']} for book in available_books]
    return jsonify(clean_books)

@app.route('/rent_book', methods=['POST']) #rent a book
def rent_book():
    title = request.form['title']
    author = request.form['author']
    isbn = request.form['isbn']
    email = session['email']

    # Update the availability of the book in the database
    db.books.update_one({'isbn': isbn}, {'$set': {'availability': False}})

    # Calculate the return date (current date + 7 days)
    rent_date = datetime.now()
    return_date = rent_date + timedelta(days=7)

    # Insert the rent record into the 'rents' collection
    db.rents.insert_one({'email': email, 'title': title, 'author': author, 'isbn': isbn, 'rent_date': rent_date, 'return_date': return_date})

    return jsonify({'message': 'Book rented successfully!'})

@app.route('/get_rented_books', methods=['GET']) #show rented books for user in session
def get_rented_books():
    email = session['email']
    rented_books = db.rents.find({'email': email, 'return_date': {'$gte': datetime.now()}})
    clean_rented_books = [{'title': book['title'], 'author': book['author'], 'isbn': book['isbn'], 'rent_date': book['rent_date'], 'return_date': book['return_date']} for book in rented_books]
    return jsonify(clean_rented_books)

@app.route('/get_all_books', methods=['GET'])  # show all books
def get_all_books():
    all_books = db.books.find()

    cleaned_books = []

    for book in all_books:
        cleaned_book = {
            'title': book['title'],
            'author': book['author'],
            'isbn': book['isbn'],
            'genre': book['genre'],
            'publication_date': book['publication_date'],
            'pages': book['pages'],
            'briefing': book['briefing'],
            'availability': book['availability']
        }

        # Check if the book is rented
        if not book['availability']:
            renter = db.rents.find_one({'isbn': book['isbn']})
            if renter:
                cleaned_book['renter'] = {
                    'email': renter['email'],
                    'rent_date' : renter['rent_date'],
                    'return_date': renter['return_date']
                }

        cleaned_books.append(cleaned_book)

    return jsonify(cleaned_books)


@app.route('/return_book', methods=['POST'])
def return_book():
    isbn = request.form['isbn']

    # Update the availability of the book in the database
    db.books.update_one({'isbn': isbn}, {'$set': {'availability': True}})

    # Remove the rent record from the 'rents' collection
    db.rents.delete_one({'isbn': isbn})

    return jsonify({'message': 'Book returned successfully!'})


@app.route('/admin')
def admin():
    if 'email' in session:
        email = session['email']
        # Fetch user information based on the email from the session
        user = db.users.find_one({'email': email})
        return render_template('admin.html', user=user)
    else:
        return redirect('/')
    
@app.route('/add_book', methods=['POST'])
def add_book():
    # Retrieve the book information from the form
    title = request.form['title']
    author = request.form['author']
    genre = request.form['genre']
    publication_date = request.form['publication_date']
    isbn = request.form['isbn']
    pages = request.form['pages']
    briefing = request.form['briefing']

    # Insert the new book into the 'books' collection
    db.books.insert_one({
        'title': title,
        'author': author,
        'genre': genre,
        'publication_date': publication_date,
        'isbn': isbn,
        'pages': pages,
        'briefing': briefing,
        'availability': True  # Assuming the book is available initially
    })

    return jsonify({'message': 'Book added successfully!'})

@app.route('/delete_book', methods=['POST'])
def delete_book():
    # Retrieve the book information from the form
    isbn = request.form['isbn']

    # Check if a book with the provided ISBN exists and is available
    book = db.books.find_one({'isbn': isbn, 'availability': True})

    if book:
        # Delete the book
        db.books.delete_one({'isbn': isbn})
        return jsonify({'message': 'Book deleted successfully!'})

    return jsonify({'message': 'Book not found or not available'})


if __name__=="__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
