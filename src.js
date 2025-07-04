// Revix 2.5 official source uploaded by guess
(function () {
    'use strict';

    const Cur_Version = 2.5;

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'get a pastebin link with raw text like 2.5 for example on it for version check',
        onload: function(response) {
            console.log("[Revix Version Check] " + response.status + " | " + response.responseText.trim())
            const latest = parseInt(response.responseText.trim(), 10);
            if (!isNaN(latest) && latest == Cur_Version || response.status !== 200) {
                const blurOverlay = document.createElement('div');
                Object.assign(blurOverlay.style, {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    zIndex: '99998',
                });
                document.body.appendChild(blurOverlay);

                const popup = document.createElement('div');
                Object.assign(popup.style, {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '80%',
                    zIndex: '99999',
                    fontFamily: 'Arial, sans-serif',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                });

                const title = document.createElement('h2');
                title.textContent = 'Outdated!';
                Object.assign(title.style, {
                    marginBottom: '16px',
                    fontSize: '24px',
                    color: '#dc2626',
                });

                const message = document.createElement('p');
                const message2 = document.createElement('p');
                message.textContent = 'Please visit the website and install the newest update to continue using Revix.';
                message2.textContent = '(Your version: ' + Cur_Version + ', Required: ' + response.responseText.trim() + ')';
                Object.assign(message.style, {
                    fontSize: '16px',
                    color: '#333',
                    marginBottom: '0',
                });

                popup.appendChild(title);
                popup.appendChild(message);
                popup.appendChild(message2);
                document.body.appendChild(popup);
            }
        }
    });

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function replaceHelloGreetingOnce() {
        const allH3s = document.querySelectorAll('h3');
        for (const h3 of allH3s) {
            if (
                [...h3.classList].some(cls => cls.startsWith('helloMessage')) &&
                h3.textContent.startsWith('Hello') &&
                !h3.dataset.greetingSet
            ) {
                const greetings = ["Hey", "Hi", "Greetings", "Salutations", "Yo", "Howdy", "Welcome", "Ahoy", "Hola", "Bonjour", "Ciao", "Namaste", "What's up", "Good day", "Peace"];
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                h3.textContent = h3.textContent.replace(/^Hello\b/, randomGreeting);
                h3.dataset.greetingSet = "true";
                break;
            }
        }
        setTimeout(replaceHelloGreetingOnce, 450);
    }

    const greetingObserver = new MutationObserver(() => {
        replaceHelloGreetingOnce();
    });
    greetingObserver.observe(document.body, { childList: true, subtree: true });

    replaceHelloGreetingOnce();

    waitForElement('div.flex.items-center.space-x-2', (targetDiv) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '5px';
        container.style.marginLeft = '10px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Username';
        Object.assign(input.style, {
            padding: '6px 10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            outline: 'none',
            fontSize: '14px'
        });

        const originalBtn = document.querySelector('a[href="https://bb.zawg.ca/home"]');
        const searchBtn = originalBtn.cloneNode(true);
        searchBtn.textContent = 'Search';
        searchBtn.href = '#';
        searchBtn.style.backgroundColor = '#22c55e';

        const dropdown = document.createElement('div');
        Object.assign(dropdown.style, {
            position: 'absolute',
            top: '100%',
            left: '0',
            zIndex: '9999',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '10px',
            marginTop: '5px',
            minWidth: '200px',
            display: 'none',
            flexDirection: 'column',
            gap: '6px'
        });

        const dropdownWrapper = document.createElement('div');
        dropdownWrapper.style.position = 'relative';
        dropdownWrapper.appendChild(dropdown);

        searchBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const username = input.value.trim();
            if (!username) return;

            const url = `https://bb.zawg.ca/search/users/results?keyword=${encodeURIComponent(username)}&maxRows=5&startIndex=0`;

            try {
                const res = await fetch(url, {
                    headers: { 'User-Agent': navigator.userAgent, 'Accept': 'application/json' }
                });
                const data = await res.json();

                dropdown.innerHTML = '';
                if (!data.UserSearchResults.length) {
                    dropdown.innerHTML = '<div style="padding:4px;">No users found.</div>';
                } else {
                    data.UserSearchResults.forEach(user => {
                        const option = document.createElement('button');
                        option.textContent = user.Name;
                        Object.assign(option.style, {
                            background: '#f9f9f9',
                            border: 'none',
                            padding: '8px 10px',
                            textAlign: 'left',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'background 0.2s ease'
                        });

                        option.addEventListener('mouseenter', () => {
                            option.style.background = '#e2e8f0';
                        });
                        option.addEventListener('mouseleave', () => {
                            option.style.background = '#f9f9f9';
                        });

                        option.addEventListener('click', () => {
                            window.location.href = `https://collectibles.zawg.ca/?user=${user.UserId}`;
                        });

                        dropdown.appendChild(option);
                    });
                }

                dropdown.style.display = 'flex';
            } catch (err) {
                console.error('Failed to fetch user search results:', err);
                dropdown.innerHTML = '<div style="color: red;">Error fetching results</div>';
                dropdown.style.display = 'flex';
            }
        });

        container.appendChild(input);
        container.appendChild(searchBtn);
        dropdownWrapper.appendChild(container);
        targetDiv.parentNode.insertBefore(dropdownWrapper, targetDiv.nextSibling);
    });
    function removeAdWrappers() {
        const ads = document.querySelectorAll('div[class^="adWrapper-"]');
        ads.forEach(ad => ad.remove());
    }
    const adObserver = new MutationObserver(() => {
        removeAdWrappers();
    });
    adObserver.observe(document.body, { childList: true, subtree: true });
    removeAdWrappers();

    function updateGameCardStyles() {
        const gameCards = document.querySelectorAll('div[class^="gameCard-"]');

        gameCards.forEach(gameCard => {
            const card = gameCard.querySelector('div[class^="card-"]');
            if (card) {
                card.style.borderRadius = '8px';
            }

            const image = gameCard.querySelector('img[class^="image-"]');
            if (image) {
                image.style.borderRadius = '8px';
            }
        });
    }

    const cardObserver = new MutationObserver(() => {
        updateGameCardStyles();
    });
    cardObserver.observe(document.body, { childList: true, subtree: true });
    updateGameCardStyles();

    function setCardBorderRadius() {
        const friendRows = document.querySelectorAll('div[class^="row friendRow-"]');
        for (const row of friendRows) {
            const card = row.closest('div').parentElement;
            if (card && card instanceof HTMLElement) {
                card.style.borderRadius = '8px';
            }
        }
    }

    setCardBorderRadius();

    const ccardObserver = new MutationObserver(() => {
        setCardBorderRadius();
    });
    ccardObserver.observe(document.body, { childList: true, subtree: true });

    (function () {
        function addBTVerifiedBadge(verified_games) {
            const allH1s = document.querySelectorAll('h1');
            for (const h1 of allH1s) {
                if ([...h1.classList].some(cls => cls.startsWith('gameTitle-'))) {
                    const gameName = h1.textContent.trim();
                    if (verified_games.includes(gameName) && !h1.querySelector('.bt-verified')) {
                        const badge = document.createElement('span');
                        badge.className = 'bt-verified';
                        badge.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="16" viewBox="0 0 24 24" width="16" style="margin-right: 4px;">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-1.2 17.4l-5.4-5.4 1.8-1.8 3.6 3.6 7.2-7.2 1.8 1.8-9 9z"/>
                        </svg>
                        <span style="color: white;">Revix ✓</span>
                    `;
                        Object.assign(badge.style, {
                            backgroundColor: '#22c55e',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            marginLeft: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            fontWeight: '500'
                        });
                        h1.appendChild(badge);
                    }
                }
            }
        }

        function fetchVerifiedGamesAndObserve() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://pastebin.com/raw/b41d9KZ3',
                onload: function (response) {
                    try {
                        const verified_games = JSON.parse(response.responseText);
                        const observer = new MutationObserver(() => addBTVerifiedBadge(verified_games));
                        observer.observe(document.body, { childList: true, subtree: true });
                        addBTVerifiedBadge(verified_games);
                    } catch (e) {
                        console.error("[Revix] Failed to parse verified games list:", e);
                    }
                },
                onerror: function (error) {
                    console.error("[Revix] Failed to load verified games list:", error);
                }
            });
        }

        fetchVerifiedGamesAndObserve();
    })();

    function appendVersionTag() {
        const buttons = document.querySelectorAll('p[class^="upgradeNowButton-"]');
        for (const btn of buttons) {
            const anchor = btn.closest('a');
            if (anchor && !anchor.nextElementSibling?.classList?.contains('btb-version')) {
                const versionTag = document.createElement('p');
                versionTag.className = 'btb-version';
                versionTag.textContent = `Revix v${Cur_Version}`;
                versionTag.style.marginTop = '8px';
                versionTag.style.fontSize = '12px';
                versionTag.style.color = '#999';

                anchor.parentNode.insertBefore(versionTag, anchor.nextSibling);
            }
        }
    }

    appendVersionTag();

    const observer = new MutationObserver(appendVersionTag);
    observer.observe(document.body, { childList: true, subtree: true });

    function styleBuyButtons() {
        const buttons = document.querySelectorAll('button[class*="buyButton-"]');
        for (const btn of buttons) {
            btn.style.borderRadius = '5px';
        }
    }

    styleBuyButtons();

    const buyobserver = new MutationObserver(styleBuyButtons);
    buyobserver.observe(document.body, { childList: true, subtree: true });

    function styleGameThumbnail() {
        const buttons = document.querySelectorAll('img[src*="https://bb.zawg.ca//images/thumbnails/"]');
        for (const btn of buttons) {
            btn.style.borderRadius = '7px';
        }
    }

    styleGameThumbnail();

    const thumbobserver = new MutationObserver(styleGameThumbnail);
    thumbobserver.observe(document.body, { childList: true, subtree: true });

    (function waitForSettingsIcon() {
        const origP = document.querySelector('p[class^="text-"] > a > span[class^="icon-nav-settings"][id="nav-settings"]')?.closest('p[class^="text-"]');
        if (!origP) {
            setTimeout(waitForSettingsIcon, 200);
            return;
        }

        if (origP.nextElementSibling?.querySelector('svg')) return;

        const newP = origP.cloneNode(false);

        const a = document.createElement('a');
        a.href = 'https://discord.gg/EAW5B2EV22';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const svgString = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="30px" height="30px" style="margin-right:5px;"><path fill="white" d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"/></svg>`;

        a.innerHTML = svgString;

        newP.appendChild(a);

        origP.parentNode.insertBefore(newP, origP.nextSibling);
    })();
})();
