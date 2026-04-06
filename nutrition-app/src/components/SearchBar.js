import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../constants";

const SearchBar = ({ setResults, apiToken }) => {
    // Keeps the current text typed in the search box.
    const [input, setInput] = useState("")

    // Loads all exercises and keeps only names that include typed text.
    const fetchData = async (searchedValue) => {
        const config = apiToken
            ? {
                headers: { Authorization: `Token ${apiToken}` },
                params: { mine: 1 }
            }
            : {};
        const response = await axios.get(API_URL, config)
        const data = response.data
        const results = data.filter((result) => {
            return searchedValue && 
            result && 
            result.name && 
            result.name.includes(searchedValue) 
        })
        setResults(results)
    }

    // Updates visible text and refreshes result list on each keystroke.
    const handleChange = async (value) => {
        setInput(value)
        fetchData(value)
    }

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input className="search-input" placeholder="Search..." value={input} onChange={(event) => handleChange(event.target.value)} />
        </div>
    )
}

export default SearchBar