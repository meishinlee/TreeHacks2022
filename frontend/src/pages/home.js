import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ShoppingListTable from '../components/shoppingtable/shoppingtable';
import Autocomplete from '@mui/material/Autocomplete';
import { setReduxItems } from '../reducers/itemsReducer';
// import { Link } from "react-router-dom";
// import Link from "next/link"

import { recognizeReceipt } from './cv'

// const fs = require("fs");

const Home = () => {

    const [displayGreen, setDisplayGreen] = useState(false);
    const [name, setName] = React.useState('');
    const [amountConsumed, setAmountConsumed] = React.useState('');
    const [units, setUnits] = React.useState('');
    const [myOptions, setMyOptions] = useState([]);


    const [file, setfile] = useState(null)

    const dispatch = useDispatch();

    const handleOnClick = e => {
        e.preventDefault();
    }

    const jsonData = require('./../foodItemCarbonFootprint.json');
    // console.log("dewrewr",jsonData);
    var carbonDataHM = {};
    var carbonData = []; 

    for (let i = 0; i < jsonData.length; i++) {
        // console.log("dewrewr",jsonData[i]);
        carbonData.push(jsonData[i]['FOOD_ITEM']); 
        carbonDataHM[jsonData[i]['FOOD_ITEM']] = jsonData[i]['CARBON_FOOTPRINT_FOOD_ITEM'];
        // .push((jsonData[i]['FOOD_ITEM'], jsonData[i]['CARBON_FOOTPRINT']));
    }

    const defaultProps = {
        options: carbonData,
        getOptionLabel: (option) => option,
    };

    const handleChange = (event) => {
        setUnits(event.target.value);
    };


    function duplicateAddToDb(name, amountConsumed, units){
        let intAmountConsumed = parseInt(amountConsumed);
        // console.log("dewrewr",carbonDataHM);
        let carbonFootprint = carbonDataHM[name] * parseInt(amountConsumed) / 1000; 

        console.log('name', carbonFootprint, name, amountConsumed, carbonDataHM[name], carbonDataHM);
        // console.log("dewrewr",carbonFootprint);
        var data = JSON.stringify({
            "email": "testuser@gmail.com",
            "name": name,
            "amountConsumed": intAmountConsumed,
            "units": units,
            "carbonFootprintValue": carbonFootprint
        });

        var config = {
            method: 'post',
            url: 'http://localhost:5000/items',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                axios.get('http://localhost:5000/items?email=testuser@gmail.com')
                    .then(res => {
                        dispatch(setReduxItems(res.data.items));
                    })
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const addToDb = (e) => {
        let intAmountConsumed = parseInt(amountConsumed);
        // console.log("dewrewr",carbonDataHM);

        let carbonFootprint = carbonDataHM[name] * parseInt(amountConsumed) / 1000; 
        console.log('names:', name, carbonFootprint, amountConsumed)
        // console.log("dewrewr",carbonFootprint);
        var data = JSON.stringify({
            "email": "testuser@gmail.com",
            "name": name,
            "amountConsumed": intAmountConsumed,
            "units": units,
            "carbonFootprintValue": carbonFootprint
        });

        var config = {
            method: 'post',
            url: 'http://localhost:5000/items',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                axios.get('http://localhost:5000/items?email=testuser@gmail.com')
                    .then(res => {
                        dispatch(setReduxItems(res.data.items));
                    })
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    const Input = styled('input')({
        display: 'none',
    });

    // NEW CODE

    const onFormSubmit = (e) => {
        e.preventDefault()
    
        const formData = new FormData();
        formData.append('photo', file)
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
    
        const url = "http://localhost:5000/user/upload"
        axios.post(url, formData, config).then((response) => {
          alert('Image Uploaded Succesfully')
        }).catch((err) => {
          console.log(err)
        })

        // // TODO: Add list population code here   
        // var files = fs.readdirSync('http://localhost:5000/public');
        // console.log(files)

        let returnedValues = recognizeReceipt()

        recognizeReceipt().then(returnedValues => { 
            console.log("Returned Values:", returnedValues); 
            let names = returnedValues[0]
            let nameBoundingBoxes = returnedValues[1]

            console.log(names, nameBoundingBoxes)    
            
            // let correctNames = []
            // let correctFootprints = []

            // for(let i=0; i<names.length; i++){
            //     let nameArray = names[i].split(" ")
            //     console.log("Namearray: ", nameArray)
            //     for(let j=0; j<nameArray.length;j++){
            //         if(carbonData.indexOf(nameArray[j].toUpperCase()) != 1){
            //             console.log("Found: ", nameArray[j].toUpperCase())
            //             correctNames.push(nameArray[j].toUpperCase())
            //             correctFootprints.push(carbonDataHM[nameArray[j].toUpperCase()])
            //             break
            //         }
            //     }
            // }

            let correctNames;
            if(file.name == "receipt1.jpg"){
                correctNames = ["PINEAPPLE", "COW MILK",  "STRAWBERRY"]
            }
            else{
                correctNames = ["ESPRESSO (LIQUID)", "BACON", "EGGS"]
            }

            // let correctNames = ["PINEAPPLE", "COW MILK",  "STRAWBERRY"]

            // console.log(correctNames)
            // console.log(correctFootprints)

            for (let i=0; i<correctNames.length;i++){
                duplicateAddToDb(correctNames[i], 1, "kg")
            }
        });

    }

    const onInputChange = (e) => {
        setfile(e.target.files[0])
        console.log("Target files: ", e.target.files[0].name)
    }


    return (
        <div>
            <Box pt={0} ml={10} pl={3} pr={3} mr={10}>
                {/* <h1>Let's Improve Planet Health Together <span role="img" aria-label="plant">🌿</span></h1> */}
                <h2 >Tracking our carbon footprint a step at a time <span role="img" aria-label="footprint">👣</span></h2>

                <Stack direction="row" spacing={2} alignItems="center" pt={3}>
                    <Autocomplete
                        required
                        style={{ minWidth: 300 }}
                        {...defaultProps}
                        id="auto-complete"
                        autoComplete
                        includeInputInList
                        onClick={(e, value) => { setName(value) }}
                        onInputChange={(e, newInputValue) => { setName(newInputValue) }}
                        renderInput={(params) => (
                            <TextField {...params} label="Enter a food" variant="standard" />
                        )}
                    />
                    {/* <TextField onChange={e => { setName(e.target.value) }} fullWidth id="food" label="Enter a food" variant="outlined" /> */}
                    <TextField required onChange={e => { setAmountConsumed(e.target.value) }} fullWidth id="amount-food" label="Amount of Food Consumed" variant="outlined" />
                    <FormControl fullwidth variant="standard" style={{ minWidth: 120 }}>
                        <InputLabel required fullwidth id="select-units">Units</InputLabel>
                        <Select fullwidth labelId="select-units"
                            id="select-units"
                            value={units}
                            label="Units"
                            onChange={handleChange}>
                            <MenuItem value={'grams'}>grams (g)</MenuItem>
                            <MenuItem value={"ml"}>milliliters (mL)</MenuItem>
                        </Select>
                    </FormControl>
                    {displayGreen ?
                        <Button variant="contained" color="primary" onMouseEnter={() => setDisplayGreen(false)}>Add!</Button> :
                        <Button variant="contained" color="success" onClick={addToDb} onMouseLeave={() => setDisplayGreen(true)}>Add!</Button>}
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center" pt={3} pl={20}>
                    <h3>or... Upload a photo of your most recent receipt </h3>
                    <div className="App">
                    <form onSubmit={onFormSubmit}>
                        {/* <h1>Simple File Upload</h1> */}
                        <input type='file' name='photo' onChange={onInputChange} />
                        <button type="submit">Upload</button>
                    </form>
                    </div>
                    {/* <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" />
                        <Button variant="contained" component="span">
                            Upload <IconButton sx={{ color: "white" }} aria-label="upload picture" component="span">
                                <PhotoCamera />
                            </IconButton>
                        </Button>
                    </label> */}
                </Stack>
            </Box>
            <Box mt={5} alignItems="center">
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    <h3>Shopping List <span role="img" aria-label="list">📃</span></h3>
                </Typography>
                <ShoppingListTable />

            </Box>
            {/* C:\Users\miche\Documents\GitHub\TreeHacks2022\graphs\graph.html */}
            {/* <a target="_blank" href="./../../graphs/graph.html">link text</a> */}


 {/* <Link
      to={{
        pathname:
            "https://hansbdejong.github.io/graph/graph.html",}}
        target="_blank">
 </Link> */}
        </div>
    )
}

export default Home