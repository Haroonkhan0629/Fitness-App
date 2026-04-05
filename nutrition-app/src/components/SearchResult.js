import React from "react"
import DetailModal from "./DetailModal";

const SearchResult = ({ result, profile, theme }) => {
    // Each result row reuses the detail modal component.
    return (
        <div className="result">
            <h4><DetailModal
                exercise={result}
                profile={profile}
                theme={theme}
            /></h4>
        </div>
    )
}

export default SearchResult