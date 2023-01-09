import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import SearchBar from "./SearchBar";
import Iframe from "./Iframe";
import {alpha} from "@mui/material/styles";

const initFrameData = {
  url: '',
  title: ''
}

const SearchEngine = () => {
  const [searchTest, setSearchText] = useState('')
  const [category, setCategory] = useState('')
  const [frameData, setFrameData] = useState(initFrameData)
  const [htmlResult, setHtmlResult] = useState('')
  const [errorText, setErrorText] = useState('')
  const [loadingNextWordPrediction, setLoadingNextWordPrediction] = useState(false)
  const [nextWordPrediction, setNextWordPrediction] = useState('')

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
    setErrorText('')
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setErrorText('')
  };

  const handleAddWordPrediction = (e) => {
    setSearchText(`${searchTest.trim()} ${nextWordPrediction.trim()} `)
    setNextWordPrediction('')
  }

  const handleSearch = (e) => {
    if (searchTest.length < 3) {
      setErrorText('Search must be at least 3 character length')
      return
    }

    const searchQuery = (searchTest.trim().toLowerCase() + ' ' + category.toLowerCase()).trim()
    console.log(searchQuery)

    setFrameData(initFrameData)
    setHtmlResult('')

    fetch(`https://azure-xl-api.azurewebsites.net/api/search?` + new URLSearchParams({
      searchString: searchQuery,
    }))
      .then(res => res.json())
      .then(data => {
        if (data === 'Nie znaleziono pasujących wyników') {
          setErrorText('Not found matching values')
        } else {
          setErrorText('')
          console.log('data', data)
          fetch(data.url)
            .then(res => res.text())
            .then(html => {
              setHtmlResult(html)
            })
            .catch(err => {
              console.log(err)
              setFrameData(data)
              // window.open(data.url, '_blank', 'noreferrer');
            })
          setFrameData(data)
        }
      })
      .catch(err => {
        setErrorText('Error occurred during fetching data')
        console.log(err)
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingNextWordPrediction(true)
      fetch('https://az-next-word-prediction.azurewebsites.net/api/word-prediction', {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          text: JSON.stringify(searchTest)
        })
      })
        .then(res => res.text())
        .then(data => {
          setNextWordPrediction(data.trim())
        })
        .catch(err => {
          console.log('Cannot get prediction')
          console.log(err)
        })
        .finally(() => {
          setLoadingNextWordPrediction(false)
        })
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTest])

  return (
    <Box px={30} py={4} height={'80vh'}>
      <Typography variant={"h3"} fontWeight={"bold"} textAlign={'center'} gutterBottom={true}>Dev Search!
        👨‍💻</Typography>
      <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
        <Box sx={{width: '100%'}}>
          <SearchBar
            value={searchTest}
            setValue={setSearchText}
            onChange={handleSearchTextChange}
          />
          {nextWordPrediction &&
            <Box
              onClick={handleAddWordPrediction}
              bgcolor={'lightgrey'}
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                p: 1,
                backgroundColor: alpha('#000000', 0.05),
                zIndex: '1000',
                "&:hover": {
                  opacity: 0.8
                }
              }}
            >{loadingNextWordPrediction ? <CircularProgress size={20}/> : nextWordPrediction}
            </Box>
          }
        </Box>
        <FormControl size={"small"} variant="outlined" sx={{m: 1, minWidth: 120}}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'Java'}>Java</MenuItem>
            <MenuItem value={'Python'}>Python</MenuItem>
            <MenuItem value={'Dotnet'}>Dotnet</MenuItem>
            <MenuItem value={'Go'}>Go</MenuItem>
            <MenuItem value={'C'}>C</MenuItem>
            <MenuItem value={'JavaScript'}>JavaScript</MenuItem>
            <MenuItem value={'Css'}>Css</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant={"contained"}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      <Typography color={"error"} textAlign={"center"}>{errorText}</Typography>
      <div style={{zIndex: '-1000', marginTop: 40}} dangerouslySetInnerHTML={{__html: htmlResult}}/>
      <Iframe style={{zIndex: '-1000', marginTop: 20, width: '100%', height: '100%'}} src={frameData.url} title={frameData.title}/>
    </Box>
  );
};

export default SearchEngine;