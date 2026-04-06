import React from "react"
import DetailModal from "./DetailModal";

const SearchResult = ({ result, profile, apiToken, theme }) => {
    // Each result row reuses the detail modal component.
    return (
        <div className="result">
            <h4><DetailModal
                exercise={result}
                profile={profile}
                apiToken={apiToken}
                theme={theme}
            /></h4>
        </div>
    )
}

export default SearchResult