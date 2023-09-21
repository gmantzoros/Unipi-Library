# Unipi Rental Library

Πληροφοριακό σύστημα που διαχειρίζεται την υλοποίηση της ψηφιακής πύλης της
δανειστικής βιβλιοθήκης του Πανεπιστημίου Πειραιώς.

## Installation
Τα collections τα οποία περιέχουν τα βιβλία και 2 δοκιμαστικούς χρήστες (ενός admin και ενός κανονικού χρήστη) καθώς και ενός δοκιμαστικού δανεισμένου βιβλίου βρίσκονται στον φάκελο db-collections.
```bash
  UnipiLibrary.books.json
  UnipiLibrary.rents.json
  UnipiLibrary.users.json
```
Το project γίνεται install και τρέχει με 2 τρόπους, αρχικά με docker-compose στο containerized web service:

```bash
  docker-compose -p unipilibrary build
  docker-compose -p unipilibrary up
```
αλλά επειδή είναι συχνό φαινόμενο τα errors μπορεί να εκτελεστεί και τρέχοντας το python file σε venv.

```bash
  python -m venv venv
  pip install Flask pymongo Flask-Session
  source venv/Scripts/activate
  python app.py
```

## Login και Register
Αρχικά στην πρώτη σελίδα του web service δίνεται η δυνατότητα στον χρήστη να κάνει Login καθώς και Register και το web service συνδέεται με το mongoDB database και εκτελεί τα κατάλληλα queries για να ελέγξει αν υπάρχει ο χρήστης στην βάση ή για να τον καταχωρήσει. Επίσης ελέγχει αν ο χρήστης είναι διαχειριστής (admin) έτσι ώστε να τον προωθήσει στην κατάλληλη σελίδα.
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/e5439785-c85c-4c44-94d4-11bbc741b255)

## Home Page/Logout/Delete Account
Μόλις ενάς κανονικός χρήστης κάνει login, εισέρχεται στο home page. Ανάλογα με τα name, surname που έχει βάλει όταν είχε κάνει register καλωσορίζεται αντίστοιχα απο το μήνυμα welcome. Στη συνέχεια μπορεί να επιλέξει να κάνει εναλλαγή ανάμεσα στις σελίδες Home, Rent και Return. Αν περάσει το ποντίκι του πάνω απο το email του μπορεί να πραγματοποιήσει Logout ή να κάνει διαγραφή του λογαριασμόυ του. 
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/6f02d147-e033-4a95-947a-b3154c42710b)

## Rent Page
Στην σελίδα Rent ο χρήστης μπορεί να κάνει αναζήτηση επιλέγοντας την κατηγορία στην οποία θέλει να κάνει την αναζήτηση.
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/0d2c10b5-ad97-488b-9e8c-736a9d56cab2)
Επίσης μπορεί να δανειστεί ένα ή περισσότερα βίβλια επιλέγοντας τα απο την λίστα και πατώντας το κουμπί Rent Selected Books. Όταν ο χρήστης περνάει το ποντίκι του πάνω απο κάποιο βιβλίο, εμφανίζονται περισσότερες πληροφορίες για αυτό.
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/e67fb3cc-3183-4dc6-90a7-10065f600d26)

## Return Page 
Στην σελίδα Return o χρήστης βλέπει τα βιβλία που έχει ήδη δανειστεί. Περνώντας το ποντίκι του πάνω απο κάποιο από αυτά βλέπει περισσότερες πληροφορίες. Στην συνέχεια μπορεί να επιλέξει ένα ή περισσότερα απο αυτά και να τα επιστρέψει πατώντας το κουμπί Return Selected Books.
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/b81bff77-8637-4913-b490-8e6b64d01d8f)

## Admin Page
Ο διαχειριστής μπορεί να κάνει login στο σύστημα βάζοντας τα στοιχεία: admin@unipi.gr ως email και admin ως password. Απο την αρχική του σελίδα που είναι η Add Book μπορεί να προσθέσει ενα βιβλίο στην βάση δεδομένων σημπληρώνοντας τα στοιχεία του και πατώντας το κουμπί Add Book. Μπορεί επίσης να περιηγηθεί στις σελίδες Delete Book, Search Book καθώς και να κάνει logout περνώντας το ποντίκι του πάνω απο το email του.
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/b2928ea2-1426-49e5-af01-8facf8c86d1a)

## Delete Book Page
Σε αυτήν την σελίδα ο διαχειριστής μπορει να κάνει delete ένα βιβλίο βάζοντας το μονάδικό isbn του βιβλίου και πατώντας το κουμπί delete book
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/ee4dbcd1-145a-4cad-acfb-140f08135fcd)

## Search Book Page
Στην σελίδα search o διαχειριστής αρχικά βλέπει όλα τα βιβλία που υπάρχουν στην βάση δεδομένων. Περνώντας το ποντίκι απο πάνω τους μπορεί να δει περισσότερες πληροφορίες για αυτά. Στη συνέχεια μπορεί να πραγματοποίησει αναζήτηση επιλέγοντας σε ποια κατηγορία θέλει να κάνει την αναζήτηση.
![image](https://github.com/gmantzoros/YpoxreotikiErgasiaSept23_E18099_Mantzoros_Georgios/assets/140251187/33ca2c01-7f91-47cd-a730-a0f730871d28)



