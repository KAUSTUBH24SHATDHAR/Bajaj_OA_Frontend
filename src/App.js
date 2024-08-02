import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput } from '@mui/material';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedInput = JSON.parse(jsonInput);

      // Call backend API
      const response = await axios.post('https://bajaj-oa-backend.onrender.com/bfhl', parsedInput);

      // Set response data
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON input or error with API call');
      setResponseData(null);
    }
  };

  const handleDropdownChange = (event) => {
    const {
      target: { value },
    } = event;
    setDropdownOptions(typeof value === 'string' ? value.split(',') : value);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    let filteredResponse = {};
    if (dropdownOptions.includes('Alphabets')) {
      filteredResponse.Alphabets = responseData.Alphabets;
    }
    if (dropdownOptions.includes('Numbers')) {
      filteredResponse.Numbers = responseData.Numbers;
    }
    if (dropdownOptions.includes('Highest alphabet')) {
      filteredResponse['Highest alphabet'] = responseData['Highest alphabet'];
    }

    return (
      <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Roll Number: YourRollNumber</h1>
      <TextField
        label="JSON Input"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={jsonInput}
        onChange={handleInputChange}
        error={!!error}
        helperText={error}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Submit
      </Button>

      {responseData && (
        <FormControl fullWidth style={{ marginTop: '20px' }}>
          <InputLabel>Options</InputLabel>
          <Select
            multiple
            value={dropdownOptions}
            onChange={handleDropdownChange}
            input={<OutlinedInput label="Options" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {['Alphabets', 'Numbers', 'Highest alphabet'].map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={dropdownOptions.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;
