import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import FavoritesDrawer from "./components/FavoritesDrawer";

const PAGE_SIZE = 12;

// PUBLIC_INTERFACE
function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Load favorites from localStorage on mount
    const fav = localStorage.getItem("book_favorites");
    if (fav) setFavorites(JSON.parse(fav));
  }, []);

  // PUBLIC_INTERFACE
  useEffect(() => {
    // Save favorites to localStorage when changed
    localStorage.setItem("book_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // PUBLIC_INTERFACE
  const fetchBooks = useCallback(
    async (search = query, index = startIndex) => {
      if (!search) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          "https://www.googleapis.com/books/v1/volumes",
          {
            params: {
              q: search,
              startIndex: index,
              maxResults: PAGE_SIZE,
            },
          }
        );
        setBooks(res.data.items || []);
        setResultCount(res.data.totalItems || 0);
      } catch (e) {
        setBooks([]);
        setResultCount(0);
      }
      setIsLoading(false);
    },
    [query, startIndex]
  );

  // PUBLIC_INTERFACE
  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
    fetchBooks(query, 0);
  };

  // PUBLIC_INTERFACE
  const handlePage = (newIndex) => {
    setStartIndex(newIndex);
    fetchBooks(query, newIndex);
  };

  // PUBLIC_INTERFACE
  const openModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  // PUBLIC_INTERFACE
  const closeModal = () => {
    setSelectedBook(null);
    setShowModal(false);
  };

  // PUBLIC_INTERFACE
  const isFavorited = (book) =>
    favorites.some((fav) => fav.id === book.id);

  // PUBLIC_INTERFACE
  const toggleFavorite = (book) => {
    if (isFavorited(book)) {
      setFavorites(favorites.filter((fav) => fav.id !== book.id));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  return (
    <div className="app">
      {/* Top nav */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-symbol" aria-label="Book">📚</span>
          <span>Book Explorer</span>
        </div>
        <form className="search-bar" onSubmit={handleSearch} autoComplete="off">
          <input
            type="text"
            placeholder="Search books (e.g. Dune, Tolkien, React)..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search books"
          />
          <button type="submit" className="btn">
            Search
          </button>
        </form>
        <button
          className="favs-btn"
          onClick={() => setShowFavorites(!showFavorites)}
          aria-label="Show favorites"
        >
          <span aria-hidden>★</span> Favorites
          {favorites.length > 0 && (
            <span className="badge" aria-label={`${favorites.length} books favorited`}>
              {favorites.length}
            </span>
          )}
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, marginTop: 82, width: "100%", maxWidth: 1150, marginLeft: "auto", marginRight: "auto", transition: "margin .17s" }}>
        <div className="hero" style={{paddingTop: query || isLoading || books.length ? 32 : 112}}>
          <div className="title" style={{fontSize: "2rem"}}>Find your next favorite book</div>
          <div className="subtitle">Powered by Google Books API</div>
          <div className="description">
            Search for fiction, technical, or nonfiction books from millions of titles. Save your favorites to revisit later.
          </div>
        </div>
        {isLoading && (
          <div className="loading" aria-live="polite">
            {/* Skeleton loader grid (same shape as grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 px-2 animate-pulse mt-4">
              {[...Array(PAGE_SIZE)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white shadow-lg border border-gray-100 p-6 flex flex-col items-center space-y-3"
                  role="status"
                  aria-label="Loading book"
                >
                  <div className="w-24 h-36 mb-3 rounded-lg bg-gray-200/70" />
                  <div className="h-4 w-24 bg-gray-200/80 rounded-full" />
                  <div className="h-3 w-16 bg-gray-200/70 rounded-full" />
                  <div className="h-6 w-6 bg-gray-100/80 rounded-full self-end" />
                </div>
              ))}
            </div>
            <span className="sr-only">Loading books...</span>
          </div>
        )}
        {!isLoading && books.length === 0 && (
          <div className="empty" aria-live="polite">
            {query ? "No books found. Try a different search." : <span>Start searching for books above!</span>}
          </div>
        )}
        {!isLoading && books.length > 0 && (
          <>
            <section className="book-grid" aria-label="Book Results">
              {books.map((book, i) => (
                <BookCard
                  key={book.id}
                  book={book}
                  openModal={openModal}
                  isFavorited={isFavorited(book)}
                  toggleFavorite={toggleFavorite}
                  // micro-animation on entrance
                  style={{ animation: `fadeInUp .33s cubic-bezier(.2,2,.6,1) ${(i * 0.05 + 0.12).toFixed(2)}s both` }}
                />
              ))}
            </section>
            <nav className="pagination" aria-label="Pagination">
              <button
                className="pagination-btn transition duration-150 focus-visible:ring-2 focus-visible:ring-secondary"
                onClick={() => handlePage(Math.max(0, startIndex - PAGE_SIZE))}
                disabled={startIndex === 0}
              >Previous</button>
              <span className="page-label" style={{color: "#888", fontWeight: 600, fontSize: 15}}>
                {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, resultCount)} of {resultCount}
              </span>
              <button
                className="pagination-btn transition duration-150 focus-visible:ring-2 focus-visible:ring-secondary"
                onClick={() => handlePage(startIndex + PAGE_SIZE)}
                disabled={startIndex + PAGE_SIZE >= resultCount}
              >Next</button>
            </nav>
          </>
        )}
      </main>
      {/* Slide-out/Persistent Favorites */}
      <FavoritesDrawer
        open={showFavorites}
        favorites={favorites}
        openModal={openModal}
        toggleFavorite={toggleFavorite}
        isFavorited={isFavorited}
        onClose={() => setShowFavorites(false)}
      />
      {/* Overlay for modal, drawer (mobile) */}
      {showModal && selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={closeModal}
          isFavorited={isFavorited(selectedBook)}
          toggleFavorite={() => toggleFavorite(selectedBook)}
        />
      )}
      {(showModal || showFavorites) && (
        <div className="overlay" onClick={() => {
          if (showModal) closeModal();
          if (showFavorites) setShowFavorites(false);
        }} aria-hidden />
      )}
    </div>
  );
}

export default App;
