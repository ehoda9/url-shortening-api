const msg = document.querySelector('#msg');
const link = document.querySelector('#short');
const shortBtn = document.querySelector('.short-it');
const loading = document.querySelector('.loadingspinner');
const links = document.querySelector('.links-group');
const reset = document.querySelector('button.reset');
const popup = document.querySelector('.popup');
const burger = document.querySelector('#menu');
const nav = document.querySelector('.nav');
const api = 'https://api.shrtco.de/v2/shorten?url=';
/* End Global vars */
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
})
reset.addEventListener('click', () => {
    links.innerHTML = "";
    reset.style.opacity = "0";
});


shortBtn.addEventListener("click", shortNow);
function shortNow() {
    if (link.value === "") {
        msg.innerHTML = "Input Can't be empty";
        msg.style.display = "block";
        link.style.border = "2px solid var(--Red)";
        setTimeout(() => {
            msg.style.display = "none";
            link.style.border = "none";
        }, 2000);
    } else if (!validURL(link.value)) {
        msg.innerHTML = "This is not valid email [https://www.example.com]";
        msg.style.display = "block";
        link.style.border = "2px solid var(--Red)";
        setTimeout(() => {
            msg.style.display = "none";
            link.style.border = "none";
        }, 2000);
    } else {
        loading.style.display = "block";
        const url = link.value;
        async function shorturl() {
            try {
                let res = await fetch(api + url);
                return await res.json();
            } catch (err) {
                throw err;
            }
        };
        let data = shorturl();
        data.then(res => {
            reset.style.opacity = "100%";
            updateUi(res);
            const copyBtn = document.querySelectorAll('button.shorted-btn');
            copyBtn.forEach((e) => {
                e.addEventListener('click', () => {
                    let copyurl = document.querySelector(`.shorted[data-url="${e.dataset.url}"]`);
                    navigator.clipboard.writeText(copyurl.dataset.url);
                    e.classList.add('copied');
                    e.innerText = "Copied!";
                    document.querySelector('.popup h1').innerText = `Url copied successfully!`;
                    document.querySelector('.popup p').innerText = `${copyurl.dataset.url}`;
                    popup.style.opacity = "100%";
                    popup.style.display = "block";
                    setTimeout(() => {
                        popup.style.opacity = "0";
                    }, 5000);
                    setTimeout(() => {
                        popup.style.display = "none";
                    }, 6000);
                });
            });
        }).catch(err => {
           throw err;
        });
    }
}
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function updateUi(data) {
    const html = `
    <div class="shorted-link">
            <div class="real">${data.result.original_link}</div>
            <div class="actions">
              <div data-url="${data.result.short_link2}" class="shorted">${data.result.short_link2}</div>
              <button data-url="${data.result.short_link2}" class="btn shorted-btn">Copy</button>
            </div>
          </div>
`;
    links.innerHTML += html;
    document.querySelector('.popup p').innerText = `${data.result.short_link2}`;
    document.querySelector('.popup h1').innerText = `Url shorted successfully!`;
    popup.style.opacity = "100%";
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.opacity = "0";
    }, 5000);
    setTimeout(() => {
        popup.style.display = "none";
    }, 6000);
    loading.style.display = "none";
};
