import { useState } from 'react'

function useInput(initialValue, validater) {
    const [value, setValue] = useState(initialValue)
    const [msg, setMsg] = useState('')
    const [err, setErr] = useState(false)

    const onChangeInput = e => {
        setValue(e.target.value)
        let [msg, err] = validater(e.target.value)
        setMsg(msg)
        setErr(err)
    }

    return [value, onChangeInput, msg, err]
}

export default useInput