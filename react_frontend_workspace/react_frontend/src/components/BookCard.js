import React from "react";
import "../App.css";

/**
 * Book card grid item for the main results.
 */
// PUBLIC_INTERFACE
function BookCard({ book, openModal, isFavorited, toggleFavorite }) {
  return (
    <div
      className="book-card"
      tabIndex={0}
      aria-label={`View details for ${book.volumeInfo?.title}`}
      onClick={() => openModal(book)}
      onKeyPress={e => { if (e.key === "Enter" || e.key === " ") openModal(book); }}
    >
      <img
        src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x180?text=No+Cover"}
        alt={book.volumeInfo?.title}
        className="cover"
        loading="lazy"
      />
      <div className="book-title">{book.volumeInfo?.title}</div>
      <div className="book-authors">{book.volumeInfo?.authors?.join(", ")}</div>
      <button
        onClick={e => { e.stopPropagation(); toggleFavorite(book); }}
        className="fav-btn"
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorited ? "★" : "☆"}
      </button>
    </div>
  );
}

export default BookCard;
