import React, { useState, useEffect } from 'react'

const DataFetch = ({ url, method, body, credentials, headers, mode, onResponse, onBadResponse, onFetchError }) => {

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        getData();
      }, []);

    const getData = () => {
        setIsFetching(true)
        fetch('https://dog.ceo/api/breeds/image/random/15')
            .then(res => {
                return !res.ok 
                    ? res.then(e => Promise.reject(e))
                    : res.json()
            })
            .then(res => {
            })
            .catch(e => { 
                console.log(e) 
            })
            .finally(() => {
                setIsFetching(false)
            })
    }

    return [];

}