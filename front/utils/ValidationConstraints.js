import { validate } from 'validate.js'

export const validateString = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
        },
    }

    if (value !== '') {
        constraints.format = {
            pattern: '.+',
            flags: 'i',
            message: "공백을 사용하실 수 없습니다",
        }
    }

    const validationResult = validate({ [id]: value }, { [id]: constraints })
    return validationResult && validationResult[id]
}

export const validateEmail = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
        },
    }

    if (value !== '') {
        constraints.email = true
    }

    const validationResult = validate({ [id]: value }, { [id]: constraints })
    return validationResult && validationResult[id]
}

export const validatePassword = (id, value) => {
    const constraints = {
        presence: {
            allowEmpty: false,
        },
    }

    if (value !== '') {
        constraints.length = {
            minimum: 6,
            message: ' 는 6글자 이상으로 입력해주세요',
        }
    }

    const validationResult = validate({ [id]: value }, { [id]: constraints })
    return validationResult && validationResult[id]
}
