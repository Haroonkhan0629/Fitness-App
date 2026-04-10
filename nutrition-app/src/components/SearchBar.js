import { useState, useRef } from "react"
import { FaSearch } from "react-icons/fa"
import axios from "axios"
import { API_URL } from "../constants";

const SearchBar = ({ setResults, apiToken }) => {
    // Keeps the current text typed in the search box.
    const [input, setInput] = useState("")
    // Holds the AbortController for the in-flight request so it can be cancelled.
    const controllerRef = useRef(null)

    // Loads all exercises and keeps only names that include typed text.
    const fetchData = async (searchedValue) => {
        // Cancel any previous in-flight request to avoid stale results overwriting current ones.
        if (controllerRef.current) {
            controllerRef.current.abort()
        }
        const controller = new AbortController()
        controllerRef.current = controller

        try {
            const config = apiToken
                ? {
                    headers: { Authorization: `Token ${apiToken}` },
                    params: { mine: 1 },
                    signal: controller.signal
                }
                : { signal: controller.signal };
            const response = await axios.get(API_URL, config)
            const data = response.data
            const results = data.filter((result) => {
                return searchedValue && 
                result && 
                result.name && 
                result.name.toLowerCase().includes(searchedValue.toLowerCase()) 
            })
            setResults(results)
        } catch (err) {
            if (!axios.isCancel(err)) {
                console.error('Search error:', err)
            }
        }
    }

    // Updates visible text and refreshes result list on each keystroke.
    const handleChange = (value) => {
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