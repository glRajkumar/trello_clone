export const useNvalid = (value) => {
    if (value === '') {
        let msg = 'Please Provide name'
        return [msg, true]
    }
    if (value.length < 3) {
        let msg = 'Name must be atleast 3 charactrs'
        return [msg, true]
    }
    if (value !== '' && value.length >= 3) {
        let msg = ''
        return [msg, false]
    }
}

export const useEvalid = (value) => {
    let atpos = value.indexOf('@')
    let dotpos = value.indexOf('.')
    let len = value.length

    if (value === '') {
        let msg = 'Please Provide email'
        return [msg, true]
    }
    if (atpos < 1 || dotpos - atpos < 2 || len - dotpos < 3) {
        let msg = 'Please provide correct email'
        return [msg, true]
    }
    if (true) {
        let msg = ''
        return [msg, false]
    }
}

export const usePvalid = (value) => {
    let RegExPat = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/

    if (value === '') {
        let msg = 'Please Provide password'
        return [msg, true]
    }
    if (!RegExPat.test(value)) {
        let msg = 'Password must contain atleast 1 Number, 1 Capital letter'
        return [msg, true]
    }
    if (value.length < 6) {
        let msg = 'Password must be atleast 6 characters'
        return [msg, true]
    }
    if (true) {
        let msg = ''
        return [msg, false]
    }
}
