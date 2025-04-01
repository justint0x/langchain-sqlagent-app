import React, { useState } from 'react';

const AgentUI = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/sqlAgent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResult(data.result);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>SQL Agent Interface</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Enter your SQL query here"
                    rows={4}
                    cols={50}
                />
                <br />
                <button type="submit">Execute Query</button>
            </form>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {result && (
                <div>
                    <h2>Result:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default AgentUI;