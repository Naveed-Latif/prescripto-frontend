// ─── Pagination helper ───────────────────────────────────────
function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const add = (p: number) => {
    if (!pages.includes(p)) pages.push(p);
  };
  add(1);
  if (current - 2 > 2) pages.push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  )
    add(p);
  if (current + 2 < total - 1) pages.push("...");
  add(total);
  return pages;
}

// ─── Pagination Component ────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageRange = buildPageRange(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2.5 py-1.5 rounded-md text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ‹
        </button>

        {pageRange.map((item, i) =>
          item === "..." ? (
            <span
              key={`e-${i}`}
              className="px-2 text-gray-400 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`px-3 py-1.5 rounded-md text-sm border transition ${
                currentPage === item
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1.5 rounded-md text-sm border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ›
        </button>
      </div>

      <div className="w-24 hidden sm:block" />
    </div>
  );
}

export default Pagination;
