import React, { useState } from 'react';
import axios from 'axios';

const AddQuote = () => {
    const [clientName, setClientName] = useState('');
    const [quoteTotal, setQuoteTotal] = useState('');
    const [quoteItems, setQuoteItems] = useState('');
    const [loader, setLoader] = useState('Add Quote');

    const url = `${appLocalizer.apiUrl}/wprk/v1/add-quote`;

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader('Adding...');

        axios.post(url, {
            client_name: clientName,
            quote_total: quoteTotal,
            quote_items: quoteItems
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': appLocalizer.nonce
            }
        })
        .then((res) => {
            if (res.data.status === 'success') {
                alert(`Quote added with ID: ${res.data.quote_id}`);
                setClientName('');
                setQuoteTotal('');
                setQuoteItems('');
            } else {
                alert('Failed to add quote');
            }
            setLoader('Add Quote');
        })
        .catch((error) => {
            console.error('Error adding quote:', error);
            setLoader('Add Quote');
        });
    };

    return (
        <React.Fragment>
            <h2>Add New Quote</h2>
            <form id="add-quote-form" onSubmit={handleSubmit}>
                <table className="form-table" role="presentation">
                    <tbody>
                        <tr>
                            <th scope="row">
                                <label htmlFor="clientName">Client Name</label>
                            </th>
                            <td>
                                <input 
                                    id="clientName" 
                                    name="clientName" 
                                    value={clientName} 
                                    onChange={(e) => setClientName(e.target.value)} 
                                    className="regular-text" 
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label htmlFor="quoteTotal">Quote Total</label>
                            </th>
                            <td>
                                <input 
                                    id="quoteTotal" 
                                    name="quoteTotal" 
                                    value={quoteTotal} 
                                    onChange={(e) => setQuoteTotal(e.target.value)} 
                                    className="regular-text" 
                                    type="number"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                <label htmlFor="quoteItems">Quote Items</label>
                            </th>
                            <td>
                                <textarea 
                                    id="quoteItems" 
                                    name="quoteItems" 
                                    value={quoteItems} 
                                    onChange={(e) => setQuoteItems(e.target.value)} 
                                    className="regular-text" 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="submit">
                    <button type="submit" className="button button-primary">{loader}</button>
                </p>
            </form>
        </React.Fragment>
    );
}

export default AddQuote;
