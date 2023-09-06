import React, { useState, useEffect } from 'react';
import { parse, unparse } from 'papaparse'; // Import the CSV library


function CSVEditor({setLoading, setResponse, updateCsvData, setCsv} : any) {
  const [csvContent, setCSVContent] = useState('');


  const handleFileUpload = (event : any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e : ProgressEvent<FileReader>) => {
      const content : string | ArrayBuffer | null | any = e?.target?.result;
      setCSVContent(content);
      updateCsvData(content);
    };

    reader.readAsText(file);
  };

  const handleSaveChanges = async () => {
    // Parse the edited CSV content into an array of objects
    const parsedData = parse(csvContent).data;

    // Perform any modifications to the parsedData as needed

    // Convert the modified data back to CSV format
    const formattedCSV = unparse(parsedData);
    updateCsvData(csvContent);
    setCsv(csvContent);
  };

  return (
      <section className='up'>
          <label htmlFor="file-input" className="custom-file-upload">
            Custom Upload
          </label>
          <input id="file-input" type="file" accept=".csv" onChange={handleFileUpload} style={{display: "none"}} />
      </section>
  );
}

export default CSVEditor;
