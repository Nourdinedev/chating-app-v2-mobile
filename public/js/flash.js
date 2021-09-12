const hideIcon = document.querySelectorAll(".x")

hideIcon.forEach((elem) => {
    elem.addEventListener("click", () => {
        const alert = elem.parentElement
        alert.classList.add("fead")
        setTimeout(() => { alert.classList.add("hide") }, 495)

    })
})