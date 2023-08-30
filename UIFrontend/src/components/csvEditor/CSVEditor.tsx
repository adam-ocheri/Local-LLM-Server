import React, { useState } from 'react';
import { parse, unparse } from 'papaparse'; // Import the CSV library
import { postCsvTrainingData } from '@/utils/apiService';

function CSVEditor({setLoading, setResponse} : any) {
  const [csvContent, setCSVContent] = useState('');

  const handleFileUpload = (event : any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e : ProgressEvent<FileReader>) => {
      const content : string | ArrayBuffer | null | any = e?.target?.result;
      setCSVContent(content);
    };

    reader.readAsText(file);
  };

  const handleSaveChanges = async () => {
    // Parse the edited CSV content into an array of objects
    const parsedData = parse(csvContent).data;

    // Perform any modifications to the parsedData as needed

    // Convert the modified data back to CSV format
    const formattedCSV = unparse(parsedData);

    await postCsvTrainingData(formattedCSV, setLoading, setResponse)
    // Now you can choose to download the CSV or save it to a server
    // For example, trigger a download link or make a POST request
  };

  return (
    <section style={{margin: '25px'}}>
        <h3 style={{fontSize: '24pt', textAlign: 'center'}}>Fine Tune</h3>
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{margin: '5px'}}/>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
            <textarea
                style={{margin: '5px'}}
                value={csvContent}
                onChange={(e) => setCSVContent(e.target.value)}
            />
            <button onClick={handleSaveChanges} style={{margin: '5px'}}>Save Changes</button>
        </div>
    </section>
  );
}

export default CSVEditor;
