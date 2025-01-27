let authors = []
let currentPage = 1
const authorsPerPage = 50

// Fetch authors data
fetch("authors.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    return response.json()
  })
  .then((data) => {
    authors = data
    updateAuthorGrid()
    updatePagination()
  })
  .catch((error) => {
    console.error("Error fetching authors:", error)
    document.getElementById("author-grid").innerHTML = "<p>Error loading authors. Please try again later.</p>"
  })

function updateAuthorGrid(searchTerm = "") {
  const authorGrid = document.getElementById("author-grid")
  authorGrid.innerHTML = ""

  const filteredAuthors = authors.filter(
    (author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.chineseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.books.some(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.translations.some(
            (translation) =>
              translation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              translation.translator.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      ),
  )

  const startIndex = (currentPage - 1) * authorsPerPage
  const endIndex = startIndex + authorsPerPage
  const pageAuthors = filteredAuthors.slice(startIndex, endIndex)

  pageAuthors.forEach((author) => {
    const authorElement = document.createElement("div")
    authorElement.className = "author-card"
    authorElement.innerHTML = `
            <img src="${author.avatar}" alt="${author.name}" onerror="this.src='https://via.placeholder.com/200x300'">
            <div class="author-card-info">
                <h3 class="author-card-name">${author.name}</h3>
                <p class="author-card-chinese-name">${author.chineseName}</p>
            </div>
        `
    authorElement.addEventListener("click", () => showAuthorBooks(author))
    authorGrid.appendChild(authorElement)
  })

  updatePagination(filteredAuthors.length)
}

function updatePagination(totalAuthors) {
  const totalPages = Math.ceil(totalAuthors / authorsPerPage)
  document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`
  document.getElementById("prev-page").disabled = currentPage === 1
  document.getElementById("next-page").disabled = currentPage === totalPages
}

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    updateAuthorGrid(document.getElementById("search-input").value)
  }
})

document.getElementById("next-page").addEventListener("click", () => {
  const totalAuthors = authors.length
  const totalPages = Math.ceil(totalAuthors / authorsPerPage)
  if (currentPage < totalPages) {
    currentPage++
    updateAuthorGrid(document.getElementById("search-input").value)
  }
})

function showAuthorBooks(author) {
  const authorDetailsUrl = `author.html?id=${encodeURIComponent(author.name)}`
  window.open(authorDetailsUrl, "_blank")
}

document.getElementById("search-button").addEventListener("click", () => {
  const searchTerm = document.getElementById("search-input").value
  currentPage = 1
  updateAuthorGrid(searchTerm)
})

document.getElementById("search-input").addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const searchTerm = event.target.value
    currentPage = 1
    updateAuthorGrid(searchTerm)
  }
})

