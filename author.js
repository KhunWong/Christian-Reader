document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search)
  const authorName = urlParams.get("id")

  if (!authorName) {
    document.body.innerHTML = "<h1>Error: Author not found</h1>"
    return
  }

  let author
  let allExpanded = false

  fetch("authors.json")
    .then((response) => response.json())
    .then((authors) => {
      author = authors.find((a) => a.name === authorName)
      if (!author) {
        document.body.innerHTML = "<h1>Error: Author not found</h1>"
        return
      }

      document.title = `${author.name} - Author Details`
      document.getElementById("author-name").textContent = `${author.name} (${author.chineseName})`
      document.getElementById("author-avatar").src = author.avatar
      document.getElementById("author-avatar").alt = author.name
      document.getElementById("author-bio").textContent = author.bio || author.chineseBio || "No biography available."
      document.getElementById("author-birthdate").textContent = `Born: ${author.birthdate || "Unknown"}`
      document.getElementById("author-nationality").textContent =
        `Nationality: ${author.nationality || author.chineseNationality || "Unknown"}`

      renderBooks(author.books)

      document.getElementById("sort-select").addEventListener("change", updateBookList)
      document.getElementById("filter-translated").addEventListener("change", updateBookList)
      document.getElementById("expand-all-button").addEventListener("click", toggleExpandAll)
    })
    .catch((error) => {
      console.error("Error fetching author data:", error)
      document.body.innerHTML = "<h1>Error: Failed to load author data</h1>"
    })

  function renderBooks(books) {
    const bookList = document.getElementById("book-list")
    bookList.innerHTML = ""

    books.forEach((book) => {
      const hasChineseTranslation = book.translations.some((t) => t.language.toLowerCase() === "chinese")
      const bookElement = document.createElement("div")
      bookElement.className = "book"
      bookElement.innerHTML = `
                <div class="book-header">
                    <i class="fas fa-chevron-right expand-icon"></i>
                    <h3>${book.title} (${book.firstEdition})</h3>
                    <span class="translation-status ${hasChineseTranslation ? "translated" : "not-translated"}">
                        <i class="fas ${hasChineseTranslation ? "fa-check" : "fa-times"} translation-status-icon"></i>
                        ${hasChineseTranslation ? "已翻译成中文" : "未翻译成中文"}
                    </span>
                </div>
                <div class="book-content">
                    <p>Author: ${book.author}</p>
                    <p>Publisher: ${book.publisher}</p>
                    <p>Language: ${book.language}</p>
                    <p>ISBN: ${book.isbn}</p>
                    <div class="translations">
                        ${book.translations
                          .map(
                            (translation) => `
                            <div class="translation">
                                <h4>${translation.title}</h4>
                                <p>Translated Author: ${translation.translatedAuthor}</p>
                                <p>Translator: ${translation.translator}</p>
                                <p>First Edition: ${translation.firstEdition}</p>
                                <p>Publisher: ${translation.publisher}</p>
                                <p>Language: ${translation.language}</p>
                                <p>ISBN: ${translation.isbn}</p>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `
      bookList.appendChild(bookElement)

      bookElement.querySelector(".book-header").addEventListener("click", () => {
        bookElement.classList.toggle("expanded")
      })
    })
  }

  function updateBookList() {
    const sortValue = document.getElementById("sort-select").value
    const filterTranslated = document.getElementById("filter-translated").checked

    let sortedBooks = [...author.books]

    if (sortValue === "date-asc") {
      sortedBooks.sort((a, b) => new Date(a.firstEdition) - new Date(b.firstEdition))
    } else if (sortValue === "date-desc") {
      sortedBooks.sort((a, b) => new Date(b.firstEdition) - new Date(a.firstEdition))
    }

    if (filterTranslated) {
      sortedBooks = sortedBooks.filter((book) => book.translations.some((t) => t.language.toLowerCase() === "chinese"))
    }

    renderBooks(sortedBooks)
    updateExpandAllButton()
  }

  function toggleExpandAll() {
    const books = document.querySelectorAll(".book")
    allExpanded = !allExpanded
    books.forEach((book) => {
      book.classList.toggle("expanded", allExpanded)
    })
    updateExpandAllButton()
  }

  function updateExpandAllButton() {
    const expandAllButton = document.getElementById("expand-all-button")
    expandAllButton.textContent = allExpanded ? "全部收起" : "全部展开"
  }
})

