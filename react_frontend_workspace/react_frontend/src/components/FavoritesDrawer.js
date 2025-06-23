import React from "react";
import "../App.css";

/**
 * Drawer (slide-out or static for larger screens) for displaying favorites list.
 */
// PUBLIC_INTERFACE
function FavoritesDrawer({ open, favorites, openModal, toggleFavorite, isFavorited, onClose }) {
  // Touch gesture to swipe right to close (only on mobile)
  const drawerRef = React.useRef(null);
  const startX = React.useRef(null);
  const dx = React.useRef(0);

  React.useEffect(() => {
    function onTouchStart(e) {
      startX.current = e.touches[0].clientX;
    }
    function onTouchMove(e) {
      if (startX.current !== null && open) {
        dx.current = e.touches[0].clientX - startX.current;
        if (dx.current > 0 && dx.current < 160 && drawerRef.current) {
          drawerRef.current.style.transform = `translateX(${dx.current}px)`;
          drawerRef.current.style.transition = "transform 0s";
        }
      }
    }
    function onTouchEnd() {
      if (dx.current > 60) {
        onClose();
      } else if (drawerRef.current) {
        drawerRef.current.style.transform = "";
        drawerRef.current.style.transition = "transform .25s cubic-bezier(.22,2.2,.4,1)";
      }
      startX.current = null;
      dx.current = 0;
    }
    const d = drawerRef.current;
    if (d && open) {
      d.addEventListener("touchstart", onTouchStart, { passive: true });
      d.addEventListener("touchmove", onTouchMove, { passive: false });
      d.addEventListener("touchend", onTouchEnd, { passive: true });
    }
    return () => {
      if (d) {
        d.removeEventListener("touchstart", onTouchStart);
        d.removeEventListener("touchmove", onTouchMove);
        d.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [open, onClose]);

  return (
    <aside
      ref={drawerRef}
      className={`favs-drawer z-[41] fixed right-0 top-0 h-full w-[305px] sm:max-w-[360px] bg-[#f9f8ff] border-l-2 border-border-color shadow-2xl transition-transform duration-300 ${open ? "open translate-x-0" : "translate-x-full"}`}
      aria-label="Book favorites"
      tabIndex={-1}
      style={{ boxShadow: open ? "0 0 32px 0 #aaa" : undefined }}
    >
      <div className="favs-header flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-inherit text-secondary font-bold text-lg">
        <span>Favorites</span>
        <button
          className="close-btn text-[1.5em] text-accent hover:text-secondary bg-none border-none transition-colors duration-100 outline-none"
          onClick={onClose}
          title="Close"
          aria-label="Close favorites drawer"
        >
          ✕
        </button>
      </div>
      <div className="favs-list overflow-y-auto px-4 py-5 flex-1">
        {favorites.length === 0 ? (
          <div className="favs-empty text-accent/60 text-center py-14 text-base">
            No favorites yet.<br />Add books with <span className="text-accent font-bold">★</span>
            <div className="mt-6 text-gray-400 text-xs select-none" aria-hidden>
              {open && <span>Swipe right to close</span>}
            </div>
          </div>
        ) : (
          <ul className="m-0 p-0 list-none">
            {favorites.map((book) => (
              <li
                key={book.id}
                className="
                  favs-book flex gap-2 items-center py-2 px-2 rounded-lg cursor-pointer
                  transition-all duration-120 hover:bg-amber-50/70 focus-visible:bg-amber-100 active:scale-[0.98] group
                "
                tabIndex={0}
                aria-label={`Details for ${book.volumeInfo?.title}`}
                onClick={() => openModal(book)}
                onKeyPress={e => { if (e.key === "Enter" || e.key === " ") openModal(book); }}
              >
                <img
                  src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/60x90?text=No+Cover"}
                  alt={book.volumeInfo?.title}
                  className="img w-10 h-14 rounded-md shadow-sm bg-gray-100"
                  draggable={false}
                />
                <div className="info flex-1 min-w-0 flex flex-col">
                  <div className="title text-[0.98em] font-semibold text-ellipsis whitespace-nowrap overflow-hidden text-primary">{book.volumeInfo?.title}</div>
                  <div className="authors text-xs text-gray-600 text-ellipsis whitespace-nowrap overflow-hidden">{book.volumeInfo?.authors?.join(", ")}</div>
                </div>
                <button
                  className="fav-btn text-accent hover:text-danger focus:outline-none pl-2 text-[1.17em] transition-colors duration-100"
                  onClick={e => { e.stopPropagation(); toggleFavorite(book); }}
                  title={isFavorited(book) ? "Remove from favorites" : "Add to favorites"}
                  aria-label={isFavorited(book) ? "Remove from favorites" : "Add to favorites"}
                  tabIndex={0}
                >
                  <span aria-hidden className="transition-transform duration-150 group-hover:scale-125">{isFavorited(book) ? "★" : "☆"}</span>
                  <span className="sr-only">{isFavorited(book) ? "Remove from favorites" : "Add to favorites"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Swipe gesture hint on mobile */}
      <div className="block sm:hidden text-xs text-center text-gray-400 pb-3 select-none" aria-hidden>
        {open && <span>Swipe right to close</span>}
      </div>
    </aside>
  );
}

export default FavoritesDrawer;
