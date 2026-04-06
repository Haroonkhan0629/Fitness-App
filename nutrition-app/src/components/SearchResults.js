import React from "react"
import SearchResult from "./SearchResult"

const SearchResults = ({ results, profile, apiToken, theme }) => {
    return (
        <div className="results">
            {
                // Renders one clickable card per matched exercise.
                results.map((result, id) => {
                    return <SearchResult result={result} profile={profile} apiToken={apiToken} theme={theme} key={id}/>
                })
            }
        </div>
    )
}

export default SearchResults