import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const Search = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const navigate = useNavigate();

	const handleSearch = (event) => {
		event.preventDefault();
		if (searchTerm.length) {
			navigate(`/startQuiz?query=${encodeURIComponent(searchTerm)}`);
		}
	};

	return (
		<div className="search-container">
			<input
				className="search-bar"
				type="text"
				placeholder="Search for questions with a keyword..."
				onChange={(e) => setSearchTerm(e.target.value)}
				onSubmit={handleSearch}
			/>
			<button className="search-button" onClick={handleSearch} disabled={!searchTerm.length}>
				{searchTerm.length ? "Search" : "Type a keyword to search"}
			</button>
		</div>
	);
};

export default Search;
