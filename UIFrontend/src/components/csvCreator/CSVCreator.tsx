import React, { useState, useEffect } from 'react';
import CSVEditor from '../csvEditor/CSVEditor';
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { parse, unparse } from 'papaparse';

function CSVCreator({ csvContent, setCSVContent, inCsv  } : any) {
    // Init data - - - - - - - - - - - - - - - - - - - - - - - - 
    const [tableData, setTableData] = useState(
    [
            ['instruction', 'input', 'output', ],
            ['Row 1 example A', 'Row 1 example B', 'Row 1 example C', ],
            ['Row 2 example A', 'Row 2 example B', 'Row 2 example C', ],
            ['Row 3 example A', 'Row 3 example B', 'Row 3 example C', ],
            ['', '', '', ],
            ['', '', '', ],
            ['', '', '', ],
            ['', '', '', ]
        ]
    );
    const [csvData, updateCsvData] : any = useState(inCsv)


    useEffect(() => {
        if (csvData) {
            const parsedData = parseCSV(csvData);
            setCSVContent(formatCSV(parsedData));
            setTableData(parsedData);
        }
    }, [csvData]);

    useEffect(()=>{
        const csvString = tableData.toString();
        setCSVContent(formatCSV(tableData));
    },[tableData])

    // Function Definitions - - - - - - - - - - - - - - - - - - - - - - - - 

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

    const parseCSV = (csvText : any) => {
        // Split the CSV text into rows and columns
        const rows = csvText.split('\n');
        const data = rows.map((row : any) => row.split(','));
        return data;
    };

    const formatCSV = (csv : any) => {
        // Convert the table data into CSV format
        const csvContent = csv.map((row : any) => row.join(',')).join('\n');
        return csvContent;
    };


    const addColumn = () => {
        // Add a new column to the table
        const updatedData : string[][] | any = tableData.map((row : any) => [...row, '']);
        setTableData(updatedData);
    };

    const addRow = () => {
        // Add a new row to the table
        const newRow : any[] = Array(tableData[0].length).fill('');
        const updatedData : string[][] | any = [...tableData, newRow];
        setTableData(updatedData);
    };

    const handleCellChange = (value : any, rowIndex : any, columnIndex : any) => {
        // Update the value of a cell
        const updatedData = tableData.map((row : any, i : number) =>
        i === rowIndex ? row.map((cell : any, j : number) => (j === columnIndex ? value : cell)) : row
        );
        setTableData(updatedData);
    };

    return (
        <Box border={'1px solid grey'} borderRadius={'0px'} padding={'4px'}>
            <Flex flexDirection={'row'} justifyContent={'space-between'}>
                <Box>
                    <Badge colorScheme='green'>Load CSV file</Badge> / <Badge colorScheme='green'>Create manually</Badge>
                </Box>
                <section style={{margin: '0px'}}>
                    <input type="file" accept=".csv" onChange={handleFileUpload} style={{margin: '5px'}}/>
                </section>
            </Flex>
            <Box borderTop={'1px solid grey'} margin={'6px'}/>
            <Button variant={'outline'} colorScheme={'blue'} size={'sm'} margin={'10px'} onClick={addColumn}>+ Column</Button>
            <Button variant={'outline'} colorScheme={'blue'} size={'sm'} margin={'10px'} onClick={addRow}>+ Row</Button>
            {/* <Button variant={'outline'} colorScheme={'blue'} onClick={exportCSV}>Export CSV</Button> */}
            <div style={{overflowX: 'auto'}}>
                
                <table>
                    <tbody>
                    {tableData.map((row : any, rowIndex: number) => (
                        <tr key={rowIndex}>
                        {row.map((cell : any, columnIndex : number) => (
                            <td key={columnIndex}>
                            <input
                                type="text"
                                value={cell}
                                onChange={(e) => handleCellChange(e.target.value, rowIndex, columnIndex)}
                            />
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>  
            </div>
            
        </Box>
    );
}

export default CSVCreator;
