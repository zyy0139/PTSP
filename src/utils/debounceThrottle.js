export function debounce(func, ms) {
    let timer
    return function() {
        clearTimeout(timer)
        setTimeout(() => func.apply(this, arguments), ms)
    }
}

export function throttle(func, ms) {
    let isThrottled = false

    return function() {
        if (isThrottled) {
            return
        }
        isThrottled = true

        func.apply(this, arguments)

        setTimeout(() => {
            isThrottled = false
        }, ms)
    }
}