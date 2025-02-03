import React from "react";

const SearchResults = ({ results, isLoggedIn, onAddToReadList, onAddToWantToReadList }) => {
	return (
		<div className="search-results">
			<h2>Search Results</h2>
			{results.length > 0 ? (
				<ul>
					{results.map((book) => (
						<li key={book.id}>
							<h3>{book.title}</h3>
							<p>{book.author}</p>
							{isLoggedIn && (
								<>
									<button onClick={() => onAddToReadList(book.id)}>Add to Read List</button>
									<button onClick={() => onAddToWantToReadList(book.id)}>Add to Want-to-Read List</button>
								</>
							)}
						</li>
					))}
				</ul>
		) : (
				<p>No results found.</p>
			)}
		</div>
	);
};

export default SearchResults;