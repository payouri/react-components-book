import { useState, useEffect, useRef } from 'react'

const useData = ({ url, method, body, credentials, headers, mode, onResponse, onBadResponse, onFetchError }) => {

    const fetchRef = useRef(null)
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null)
    const controller = new AbortController()
    const signal = controller.signal

    useEffect(() => {
        getData()
        return () => {
            if(fetchRef.current) {
                controller.abort()
            }
        }
    }, []);

    const getData = () => {
        setIsFetching(true)
        fetchRef.current = fetch(url, {
            method,
            body,
            credentials,
            headers,
            mode,
            signal
        })
            .then(res => {
                if(!res.ok)
                    Promise.reject(res)
                else {
                    const type = res.headers.get('content-type')
                    if(type.includes('application/json'))
                        return res.json()
                    else
                        return res.text()
                }
            })
            .then(res => {
                setData(res)
                typeof onResponse == 'function' && onResponse(res)
            })
            .catch(e => {
                if(e.toString().indexOf('fetch') > -1 && typeof onFetchError == 'function') {
                    onFetchError(e)
                    return
                }
                if(typeof onBadResponse == 'function') {
                    onBadResponse(e)
                } else 
                    throw new TypeError(e)
            })
            .finally(() => {
                setIsFetching(false)
                fetchRef.current = null
            })
    }

    return [isFetching, data];

}

export default useData;
