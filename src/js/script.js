class Gallery {
    constructor(root) {
        this.root = root;
        this.options = {
            selector: '[data-gallery-item]',
            plugins: [lgThumbnail],
            thumbnail: true,
            zoom: true,
            download: true,
            speed: 500,
        }

        this.init();
    }

    init() {
        lightGallery(this.root, this.options);
    }
}

class Arena {
    MAX_MEDIA_992 = window.matchMedia('(max-width: 991px)');

    init() {
        this.initHeader();
        this.initFoldedElements();
        this.initAccordions();
        this.initSliders();
        this.initPopups();
        this.initStickySidebar();
        this.initCookie();
        this.initSearches();
        this.initGalleries();
    }

    initSearches() {
        const searches = document.querySelectorAll('.search');
        if (!searches.length) return;

        // Закрытие при клике вне любого поиска
        document.addEventListener('click', (e) => {
            const target = e.target;
            const activeSearches = document.querySelectorAll('.search.is-open');
            activeSearches.forEach((s) => {
                if (!s.contains(target) && !target.closest('[data-search-open]')) {
                    s.classList.remove('is-open');
                    const results = s.querySelector('.search__results');
                    if (results) results.classList.remove('is-visible');
                }
            });
        });

        // ESC закрывает активный поиск
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            const activeSearches = document.querySelectorAll('.search.is-open');
            activeSearches.forEach((s) => {
                s.classList.remove('is-open');
                const results = s.querySelector('.search__results');
                if (results) results.classList.remove('is-visible');
            });
        });

        searches.forEach((search) => {
            const input = search.querySelector('.search__input');
            const reset = search.querySelector('.search__reset');
            const results = search.querySelector('.search__results');

            if (input) {
                // Показываем/прячем результаты при вводе
                input.addEventListener('input', () => {
                    const val = input.value.trim();
                    if (results) results.classList.toggle('is-visible', Boolean(val));
                    // Автокласс открытия для не-хедерных поисков
                    search.classList.add('is-open');
                });

                // Фокус — открываем
                input.addEventListener('focus', () => {
                    search.classList.add('is-open');
                });
            }

            if (reset) {
                reset.addEventListener('click', () => {
                    if (input) input.value = '';
                    if (results) results.classList.remove('is-visible');
                    search.classList.remove('is-open');
                });
            }
        });
    }

    initHeader() {
        const self = this;
        const header = document.querySelector('.site-header');
        if (!header) return;

        const pageSidebar = document.querySelector('.site-page__sidebars:not(.site-page__sidebars--mobile)');

        animateHeader();
        initBurgerMenu();
        initHeaderSearchToggle(); // ← только открытие/фокус

        function initBurgerMenu() {
            const burger = header.querySelector('.burger');
            const burgerMenu = header.querySelector('.menu');
            if (!burger || !burgerMenu) return;

            burger.addEventListener('click', () => {
                burger.classList.toggle('is-active');
                burgerMenu.classList.toggle('is-open');
                document.body.classList.toggle('is-lock');
            });
        }

        function initHeaderSearchToggle() {
            const headerSearch = header.querySelector('.search');
            const headerSearchButton = header.querySelector('.site-header__search-button');

            if (!headerSearch || !headerSearchButton) return;

            headerSearch.id ||= 'headerSearch';
            headerSearchButton.setAttribute('data-search-open', `#${headerSearch.id}`);

            headerSearchButton.addEventListener('click', () => {
                headerSearch.classList.add('is-open');
                const input = headerSearch.querySelector('.search__input');
                if (input) input.focus();
            });
        }

        function animateHeader() {
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY || 0;
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.classList.add('is-scrolling-down');
                } else {
                    header.classList.remove('is-scrolling-down');
                }
                lastScrollTop = scrollTop;
            });
        }
    }

    initSliders() {
        const sliders = document.querySelectorAll('[data-slider]');

        if (!sliders) return;

        const DEFAULT_OPTIONS = {
            slidesPerView: 'auto',
            speed: 1000,
            grabCursor: true,
            spaceBetween: 24,
        }

        sliders.forEach(slider => {
            const sliderType = slider.dataset.slider;
            const options = getOptionsByType(slider, sliderType);

            const sliderSwiper = new Swiper(slider, options);
        })

        function getOptionsByType(slider, type) {
            let options = { ...DEFAULT_OPTIONS };

            switch (type) {
                case 'banners':
                    options = {
                        ...options,
                        loop: true,
                        autoplay: {
                            delay: 3000
                        },
                        pagination: {
                            el: '.banners-slider__pagination',
                            clickable: true,
                        },
                    }
                    break;
                case 'gallery': {
                    const galleryPrev = slider.closest('.gallery').querySelector('.gallery__arrow--prev');
                    const galleryNext = slider.closest('.gallery').querySelector('.gallery__arrow--next');

                    options = {
                        ...options,
                        loop: true,
                        pagination: {
                            el: '.gallery__pagination',
                            clickable: true,
                        },
                        navigation: {
                            prevEl: galleryPrev,
                            nextEl: galleryNext,
                        }
                    }

                    break;
                }
                case 'authors': {
                    const authorsPrev = slider.closest('.other-authors__slider').querySelector('.other-authors__arrow--prev');
                    const authorsNext = slider.closest('.other-authors__slider').querySelector('.other-authors__arrow--next');

                    options = {
                        ...options,
                        slidesPerView: 'auto',
                        spaceBetween: 8,
                        navigation: {
                            prevEl: authorsPrev,
                            nextEl: authorsNext,
                        },
                        breakpoints: {
                            767: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            900: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                            991: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1200: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            }
                        }
                    }

                    break;
                }
                case 'recommended-players': {
                    const authorsPrev = slider.closest('.recommended-players__slider').querySelector('.recommended-players__arrow--prev');
                    const authorsNext = slider.closest('.recommended-players__slider').querySelector('.recommended-players__arrow--next');

                    options = {
                        ...options,
                        slidesPerView: 'auto',
                        spaceBetween: 8,
                        navigation: {
                            prevEl: authorsPrev,
                            nextEl: authorsNext,
                        },
                        breakpoints: {
                            767: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            900: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                            991: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1200: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            }
                        }
                    }

                    break;
                }
                case 'articles-404': {
                    const articles404Prev = slider.closest('.articles-404__slider').querySelector('.articles-404__arrow--prev');
                    const articles404Next = slider.closest('.articles-404__slider').querySelector('.articles-404__arrow--next');

                    options = {
                        ...options,
                        slidesPerView: 'auto',
                        spaceBetween: 24,
                        enabled: false,
                        navigation: {
                            prevEl: articles404Prev,
                            nextEl: articles404Next,
                        },
                        breakpoints: {
                            991: {
                                loop: true,
                                slidesPerView: 4,
                                enabled: true
                            },

                        }
                    }

                    break;
                }
                case 'other-articles': {
                    const otherArticlesPrev = slider.closest('.other-articles').querySelector('.other-articles__arrow--prev');
                    const otherArticlesNext = slider.closest('.other-articles').querySelector('.other-articles__arrow--next');

                    options = {
                        ...options,
                        slidesPerView: 'auto',
                        spaceBetween: 16,
                        loop: true,
                        navigation: {
                            prevEl: otherArticlesPrev,
                            nextEl: otherArticlesNext,
                        },
                        breakpoints: {
                            0: {
                                loop: false,
                                enabled: false,
                            },
                            479: {
                                slidesPerView: 2,
                            },
                            767: {
                                spaceBetween: 24,
                                slidesPerView: 3,
                            },
                            992: {
                                slidesPerView: 2
                            },
                            1200: {
                                slidesPerView: 3
                            }
                        }
                    }

                    break;
                }
                case "sports-tabs": {
                    const sportsTabsPrev = slider.closest('.sports-tabs').querySelector('.sports-tabs__arrow--prev');
                    const sportsTabsNext = slider.closest('.sports-tabs').querySelector('.sports-tabs__arrow--next');

                    options = {
                        ...options,
                        spaceBetween: 4,
                        navigation: {
                            prevEl: sportsTabsPrev,
                            nextEl: sportsTabsNext,
                        }
                    }
                    break;
                }
            }

            return options;
        }
    }

    initFoldedElements() {
        const foldedElements = document.querySelectorAll('[data-fold]');

        if (!foldedElements) return;

        foldedElements.forEach(foldedElement => {
            const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
            const foldedElementContent = foldedElement.querySelector('[data-fold-content]')

            heightToggleElement(foldedElementBtn, foldedElementContent);
        })

        function heightToggleElement(toggler, blocks) {
            if (!toggler) return;

            toggler.addEventListener("click", (e) => {
                e.preventDefault();

                if (blocks instanceof NodeList) {
                    blocks.forEach(function (block) {
                        addFunctionality(toggler, block);
                    });
                } else {
                    addFunctionality(toggler, blocks);
                }
            });

            function addFunctionality(toggler, block) {
                if (block.style.height === "0px" || !block.style.height && !block.classList.contains('is-expanded')) {
                    block.style.height = `${block.scrollHeight}px`;
                    toggler.classList.add("is-active");
                    block.classList.add("is-expanded");
                } else {
                    block.style.height = `${block.scrollHeight}px`;
                    window.getComputedStyle(block, null).getPropertyValue("height");
                    block.style.height = "0";
                    toggler.classList.remove("is-active");
                    block.classList.remove("is-expanded");
                }

                block.addEventListener("transitionend", () => {
                    if (block.style.height !== "0px") {
                        block.style.height = "auto";
                    }
                });
            }
        }
    }

    initAccordions() {
        const accordions = document.querySelectorAll('[data-accordion]');

        if (!accordions) return;

        accordions.forEach(accordion => {
            const accordionFoldedElements = accordion.querySelectorAll('[data-fold]');

            accordionFoldedElements.forEach((foldedElement, i) => {
                const foldedElementBtn = foldedElement.querySelector('[data-fold-btn]');
                const foldedElementsWithoutCurrent = Array.from(accordionFoldedElements).filter((element, j) => i !== j);

                foldedElementBtn.addEventListener('click', () => closeOtherFoldedElements(foldedElementsWithoutCurrent));
            })

        })

        function closeOtherFoldedElements(foldedElements) {
            foldedElements.forEach(element => {
                const foldedElementBtn = element.querySelector('[data-fold-btn]');
                const foldedElementContent = element.querySelector('[data-fold-content]');

                foldedElementContent.style.height = `${foldedElementContent.scrollHeight}px`;
                window.getComputedStyle(foldedElementContent, null).getPropertyValue("height");
                foldedElementContent.style.height = "0";
                foldedElementBtn.classList.remove("is-active");
                foldedElementContent.classList.remove("is-expanded");

                foldedElementContent.addEventListener("transitionend", () => {
                    if (foldedElementContent.style.height !== "0px") {
                        foldedElementContent.style.height = "auto";
                    }
                });
            })
        }
    }

    initPopups() {
        const popupsContainer = document.querySelector(".popups");

        if (!popupsContainer) return;

        const popups = popupsContainer.querySelectorAll(".popup");

        popups.forEach((popup) => {
            const popupType = popup.dataset.popup;
            const popupButtons = document.querySelectorAll(`[data-popup-open="${popupType}"]`);
            const popupContent = popup.querySelector('.popup__content');

            if (popupButtons) initPopupButtons();
            popup.addEventListener('click', handleClickOverlay);

            function initPopupButtons() {
                popupButtons.forEach(button => {
                    button.addEventListener('click', handlePopupButton);
                })
            }

            function handlePopupButton() {
                openPopup(popup)
            }

            function handleClickOverlay(e) {
                const { target } = e;

                if (!popupContent.contains(target)) {
                    closePopup(popup);
                }
            }
        })

        popupsContainer.addEventListener("click", function (e) {
            if (e.target.closest("[data-popup-close]")) {
                closeAllPopups();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeAllPopups();
            }
        });

        function openPopup(popup) {
            document.body.classList.add("is-lock");
            popupsContainer.classList.add("popups--open");
            popup.classList.add("popup--active");
        }

        function closePopup(popup) {
            document.body.classList.remove("is-lock");
            popupsContainer.classList.remove("popups--open");
            popup.classList.remove("popup--active");
        }

        function closeAllPopups() {
            const activePopups = [...popups].filter(popup => popup.classList.contains("popup--active"));

            if (!activePopups) return;

            activePopups.forEach((popup) => {
                popup.classList.remove("popup--active");
            });
            popupsContainer.classList.remove("popups--open");
            document.body.classList.remove("is-lock");
        }
    }

    initCookie() {
        const cookiePopup = document.querySelector('.cookie');

        if (!cookiePopup) return;

        const isCookieAccepted = getCookie('cookie_accepted');

        if (isCookieAccepted) return;

        cookiePopup.classList.add('cookie--visible');

        const cookiePopupButton = cookiePopup.querySelector('.cookie__button');

        cookiePopupButton.addEventListener('click', handleCookieButtonClick);

        function handleCookieButtonClick() {
            const options = { "max-age": 24 * 60 * 60 }

            setCookie('cookie_accepted', true, options);
            cookiePopup.classList.remove('cookie--visible');
        }

        function setCookie(name, value, options = {}) {
            options = {
                path: '/',
                Secure: true,
                SameSite: 'Lax',
                ...options
            };

            if (options.expires instanceof Date) {
                options.expires = options.expires.toUTCString();
            }

            let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

            for (const [key, value] of Object.entries(options)) {
                updatedCookie += "; " + key;

                if (value !== true) {
                    updatedCookie += "=" + value;
                }
            }

            document.cookie = updatedCookie;
        }

        function getCookie(name) {
            const matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));

            return matches ? decodeURIComponent(matches[1]) : undefined;
        }

    }

    initStickySidebar() {
        const stickySidebar = document.querySelector('[data-sticky-sidebar]');

        if (!stickySidebar || this.MAX_MEDIA_992.matches) return;

        const header = document.querySelector('.site-header');
        const headerHeight = header?.offsetHeight || 0;
        const stickySidebarBody = stickySidebar.querySelector('.site-page__sidebars-body');
        const stickySidebarHeight = stickySidebarBody.scrollHeight;
        const isSidebarHighWindow = window.innerHeight < stickySidebarHeight;

        if (isSidebarHighWindow) {
            initScrollable();
        } else {
            initSimple();
        }

        function initScrollable() {
            const options = {
                topSpacing: headerHeight + 24,
                bottomSpacing: 24,
                minWidth: 991,
                innerWrapperSelector: '.site-page__sidebars-body',
            }
            const stickySidebarInstance = new StickySidebar(stickySidebar, options);

            setTimeout(() => {
                stickySidebarInstance.updateSticky();
            }, 0);
        }

        function initSimple() {
            stickySidebarBody.classList.add('site-page__sidebars-body--simple-sticky');

            window.addEventListener('scroll', handleWindowScroll);

            function handleWindowScroll() {
                if (!header.classList.contains('is-scrolling-down')) {
                    stickySidebarBody.style.top = headerHeight + 24 + "px";
                } else {
                    stickySidebarBody.style.top = '';
                }
            }
        }
    }

    initGalleries() {
        const galleries = document.querySelectorAll('[data-gallery]');

        if (!galleries.length || typeof window.lightGallery !== 'function') return;

        galleries.forEach(gallery => new Gallery(gallery));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const app = new Arena();

    app.init();
});