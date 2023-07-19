import React, { useState, useEffect } from 'react'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import 'leaflet-geosearch/dist/geosearch.css'
// Define the SearchResult type based on the response from OpenStreetMapProvider
type SearchResult = {
  x: string
  y: string
  label: string
  bounds: [[number, number], [number, number]]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any
}

const provider = new OpenStreetMapProvider()

const AddressInput: React.FC = () => {
  const [value, setValue] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (value.length > 2) {
      // Only search if the input value has 3 or more characters
      // Clear the previous timeout if there is one
      const timeoutId = setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        provider.search({ query: value }).then((results: any) => setResults(results), console.error)
      }, 500) // Wait for 500ms before start searching

      // Clear the timeout when the component is unmounted or the value is changed
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
    }
  }, [value])

  const handleResultSelect = (result: SearchResult) => {
    setValue(result.label)
    setResults([])
  }

  return (
    <div>
      <input type='text' value={value} onChange={(e) => setValue(e.target.value)} />
      {results.map((result: SearchResult) => (
        <div key={result.x}>
          <button onClick={() => handleResultSelect(result)}>{result.label}</button>
        </div>
      ))}
    </div>
  )
}

export default AddressInput
