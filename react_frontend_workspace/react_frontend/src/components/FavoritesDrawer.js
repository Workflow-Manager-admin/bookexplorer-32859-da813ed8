import React from "react";
import "../App.css";

/**
 * Drawer (slide-out or static for larger screens) for displaying favorites list.
 */
// PUBLIC_INTERFACE
function FavoritesDrawer({ open, favorites, openModal, toggleFavorite, isFavorited, onClose }) {
  return (
    <aside
      className={`favs-drawer${open ? " open" : ""}`}
      aria-label="Book favorites"
      tabIndex={-1}
      style={{}}
    >
      <div className="favs-header">
        <span>Favorites</span>
        <button className="close-btn" style={{fontSize: "1.5em", color: "#aaa", background: "none", border: "none"}} onClick={onClose} title="Close">
          ✕
        </button>
      </div>
      <div className="favs-list">
        {favorites.length === 0 ? (
          <div className="favs-empty">
            No favorites yet.<br />Add books with <span style={{color: "var(--accent)"}}>★</span>
          </div>
        ) : (
          <ul style={{margin: 0, padding: 0, listStyle: "none"}}>
            {favorites.map((book) => (
              <li
                key={book.id}
                className="favs-book"
                tabIndex={0}
                aria-label={`Details for ${book.volumeInfo?.title}`}
                onClick={() => openModal(book)}
                onKeyPress={e => { if (e.key === "Enter" || e.key === " ") openModal(book); }}
              >
                <img
                  src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/60x90?text=No+Cover"}
                  alt={book.volumeInfo?.title}
                  className="img"
                />
                <div className="info">
                  <div className="title">{book.volumeInfo?.title}</div>
                  <div className="authors">{book.volumeInfo?.authors?.join(", ")}</div>
                </div>
                <button
                  className="fav-btn"
                  onClick={e => { e.stopPropagation(); toggleFavorite(book); }}
                  title={isFavorited(book) ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isFavorited(book) ? "Remove from favorites" : "Add to favorites"}
                  tabIndex={0}
                >
                  {isFavorited(book) ? "★" : "☆"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default FavoritesDrawer;
