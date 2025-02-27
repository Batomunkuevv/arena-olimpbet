class Arena {
    constructor() {
        this.init();
    }

    init() {
        this.initHeader();
        this.initFoldedElements();
        this.initAccordions();
        this.initSliders();
    }

    initHeader() {
        const header = document.querySelector('.site-header');

        if (!header) return;

        animateHeader();
        initHeaderSearch();
        initBurgerMenu();

        function initBurgerMenu() {
            const burger = header.querySelector('.burger');
            const burgerMenu = header.querySelector('.menu');

            if (!burger || !burgerMenu);

            burger.addEventListener('click', handleBurgerClick);

            function handleBurgerClick() {
                burger.classList.toggle('is-active');
                burgerMenu.classList.toggle('is-open');
                document.body.classList.toggle('is-lock');
            }
        }

        function initHeaderSearch() {
            const headerSearch = header.querySelector('.search');
            const headerSearchButton = header.querySelector('.site-header__search-button');

            if (!headerSearch || !headerSearchButton) return;

            const headerSearchInput = header.querySelector('.search__input');
            const headerSearchReset = header.querySelector('.search__reset');
            const headerSearchResults = header.querySelector('.search__results');

            window.addEventListener('click', handleClickOutside);
            headerSearchButton.addEventListener('click', showSearch);
            headerSearchInput.addEventListener('input', handleSearchInput);

            if (headerSearchReset) headerSearchReset.addEventListener('click', handleResetClick);

            function handleSearchInput(e) {
                const { target } = e;
                const searchValue = target.value;

                if (searchValue) {
                    headerSearchResults.classList.add('is-visible');
                } else {
                    headerSearchResults.classList.remove('is-visible');
                }
            }

            function handleResetClick() {
                headerSearchResults.classList.remove('is-visible');

                if (headerSearch.classList.contains('is-open')) {
                    closeSearch();
                }
            }

            function handleClickOutside(e) {
                const { target } = e;
                const isSearchButton = target === headerSearchButton;
                const isInsideSearch = target.closest('.site-header__search');

                if (!isInsideSearch && !isSearchButton) {
                    closeSearch();
                }
            }

            function closeSearch() {
                headerSearch.classList.remove('is-open');
            }

            function showSearch() {
                headerSearch.classList.add('is-open');
            }
        }

        function animateHeader() {
            let lastScrollTop;

            window.addEventListener('scroll', handleWindowScroll);

            function handleWindowScroll() {
                const scrollTop = document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.classList.add('is-scrolling-down');
                } else {
                    header.classList.remove('is-scrolling-down');
                }

                lastScrollTop = scrollTop;
            }
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
}

window.addEventListener('DOMContentLoaded', new Arena());