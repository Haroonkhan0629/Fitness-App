import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { useState } from "react"

const Search = ({ profile, theme, apiToken }) => {
    // Stores exercises that match the current search text.
    const [results, setResults] = useState([])

    return (
        <ul className="navigation">
            <li classname="search-bar-container">
                <SearchBar setResults={setResults} apiToken={apiToken}/>
                <SearchResults results={results} profile={profile} apiToken={apiToken} theme={theme}/>
            </li>
        </ul>
    )
}

export default Search