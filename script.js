const books = [
    {
        id: 1,
        coverImage: 'https://placeholder.svg?height=150&width=100',
        originalName: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        firstEditionDate: '1925-04-10',
        publisher: 'Charles Scribner\'s Sons',
        language: 'English',
        isbn: '9780743273565',
        translatedVersions: [
            {
                id: 1,
                coverImage: 'https://placeholder.svg?height=150&width=100',
                translatedTitle: 'Le Grand Gatsby',
                translator: 'Jacques Tournier',
                firstEditionDate: '1926-05-15',
                publisher: 'Éditions Grasset',
                isbn: '9782246819554',
            },
            {
                id: 2,
                coverImage: 'https://placeholder.svg?height=150&width=100',
                translatedTitle: 'Der große Gatsby',
                translator: 'Bettina Abarbanell',
                firstEditionDate: '1926-10-01',
                publisher: 'Diogenes Verlag',
                isbn: '9783257243321',
            },
        ],
    },
    {
        id: 2,
        coverImage: 'https://placeholder.svg?height=150&width=100',
        originalName: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        firstEditionDate: '1960-07-11',
        publisher: 'J. B. Lippincott & Co.',
        language: 'English',
        isbn: '9780446310789',
        translatedVersions: [
            {
                id: 3,
                coverImage: 'https://placeholder.svg?height=150&width=100',
                translatedTitle: 'Matar un ruiseñor',
                translator: 'Baldomero Porta',
                firstEditionDate: '1961-10-31',
                publisher: 'Ediciones B',
                isbn: '9788466341769',
            },
        ],
    },
    {
        id: 3,
        coverImage: 'https://placeholder.svg?height=150&width=100',
        originalName: '1984',
        author: 'George Orwell',
        firstEditionDate: '1949-06-08',
        publisher: 'Secker & Warburg',
        language: 'English',
        isbn: '9780451524935',
        translatedVersions: [
            {
                id: 4,
                coverImage: 'https://placeholder.svg?height=150&width=100',
                translatedTitle: '1984',
                translator: 'Amélie Audiberti',
                firstEditionDate: '1950-06-08',
                publisher: 'Gallimard',
                isbn: '9782070368228',
            },
            {
                id: 5,
                coverImage: 'https://placeholder.svg?height=150&width=100',
                translatedTitle: '1984',
                translator: 'Michael Walter',
                firstEditionDate: '1984-01-01',
                publisher: 'Ullstein Taschenbuch',
                isbn: '9783548234106',
            },
        ],
    },
];

function createBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.className = 'book-item';

    const bookDetails = document.createElement('div');
    bookDetails.className = 'book-details';

    const coverImage = document.createElement('img');
    coverImage.src = book.coverImage;
    coverImage.alt = `Cover of ${book.originalName}`;
    coverImage.className = 'book-cover';

    const bookInfo = document.createElement('div');
    bookInfo.className = 'book-info';

    bookInfo.innerHTML = `
        <h2>${book.originalName}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>First Edition:</strong> ${book.firstEditionDate}</p>
        <p><strong>Publisher:</strong> ${book.publisher}</p>
        <p><strong>Language:</strong> ${book.language}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
    `;

    bookDetails.appendChild(coverImage);
    bookDetails.appendChild(bookInfo);
    bookElement.appendChild(bookDetails);

    if (book.translatedVersions && book.translatedVersions.length > 0) {
        const translatedVersions = document.createElement('div');
        translatedVersions.className = 'translated-versions';
        translatedVersions.innerHTML = '<h3>Translated Versions</h3>';

        book.translatedVersions.forEach(version => {
            const versionElement = document.createElement('div');
            versionElement.className = 'translated-version';

            const versionCover = document.createElement('img');
            versionCover.src = version.coverImage;
            versionCover.alt = `Cover of ${version.translatedTitle}`;
            versionCover.className = 'translated-cover';

            const versionInfo = document.createElement('div');
            versionInfo.className = 'translated-info';
            versionInfo.innerHTML = `
                <h4>${version.translatedTitle}</h4>
                <p><strong>Translator:</strong> ${version.translator}</p>
                <p><strong>First Edition:</strong> ${version.firstEditionDate}</p>
                <p><strong>Publisher:</strong> ${version.publisher}</p>
                <p><strong>ISBN:</strong> ${version.isbn}</p>
            `;

            versionElement.appendChild(versionCover);
            versionElement.appendChild(versionInfo);
            translatedVersions.appendChild(versionElement);
        });

        bookElement.appendChild(translatedVersions);
    }

    return bookElement;
}

function displayBooks(booksToDisplay) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    booksToDisplay.forEach(book => {
        const bookElement = createBookElement(book);
        bookList.appendChild(bookElement);
    });
}

function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book =>
        book.originalName.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        (book.translatedVersions && book.translatedVersions.some(version =>
            version.translatedTitle.toLowerCase().includes(searchTerm) ||
            version.translator.toLowerCase().includes(searchTerm)
        ))
    );

    displayBooks(filteredBooks);
}

document.addEventListener('DOMContentLoaded', () => {
    displayBooks(books);

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchBooks);

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchBooks();
        }
    });
});