(() => {
    "use strict";
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const animationThimble = () => {
        const gameElement = document.querySelector(".page__game");
        if (gameElement) setInterval((() => {
            gameElement.classList.add("animate");
            gameElement.classList.remove("start");
            setTimeout((() => {
                gameElement.classList.remove("animate");
                gameElement.classList.add("start");
            }), 3e3);
        }), 15e3);
    };
    const animationButtonPlay = () => {
        const buttonPlay = document.querySelector(".page__button-play");
        if (buttonPlay) setInterval((() => {
            buttonPlay.classList.add("animate");
            setTimeout((() => {
                buttonPlay.classList.remove("animate");
            }), 3e3);
        }), 8e3);
    };
    class ShellGame {
        constructor() {
            this.gameContainer = document.querySelector(".game-container");
            console.log("gameContainer:", this.gameContainer);
            this.gameElement = this.gameContainer ? this.gameContainer.querySelector(".page__game") : null;
            console.log("gameElement:", this.gameElement);
            this.itemContainers = this.gameElement ? Array.from(this.gameElement.querySelectorAll(".game__item")) : [];
            console.log("itemContainers:", this.itemContainers);
            this.items = this.itemContainers;
            console.log("items:", this.items);
            this.playButton = document.getElementById("startGameBtn");
            console.log("playButton:", this.playButton);
            this.bonusBigImage = "img/bonus/bonus-big.webp";
            this.clickedOnce = false;
            this.shuffleCount = 10;
            this.shuffleDelay = 500;
            this.clickDelay = 1e3;
            this.init();
        }
        init() {
            if (this.playButton) this.playButton.addEventListener("click", (() => this.startGame())); else console.error("Play button not found");
            this.disableItemClick();
        }
        startGame() {
            if (!this.gameContainer || !this.items.length) {
                console.error("Game container or items not found");
                return;
            }
            this.gameContainer.classList.add("start-game");
            this.items.forEach((item => item.classList.remove("item-active")));
            setTimeout((() => {
                this.performShuffles(this.shuffleCount);
            }), this.clickDelay);
        }
        performShuffles(count) {
            let shuffleCount = 0;
            const shuffleInterval = () => {
                if (shuffleCount < count) {
                    this.shuffleItems();
                    shuffleCount++;
                    setTimeout(shuffleInterval, this.shuffleDelay);
                } else setTimeout((() => {
                    this.enableItemClick();
                    this.addChooseItemClass();
                }), this.shuffleDelay);
            };
            shuffleInterval();
        }
        shuffleItems() {
            const totalItems = this.items.length;
            const indices = Array.from({
                length: totalItems
            }, ((_, i) => i));
            const shuffledIndices = this.shuffleArray([ ...indices ]);
            this.items.forEach(((item, index) => {
                item.setAttribute("data-index-item", shuffledIndices[index]);
                item.style.transform = this.getTransform(index, shuffledIndices[index]);
            }));
            console.log("Shuffled indices:", shuffledIndices);
        }
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [ array[j], array[i] ];
            }
            return array;
        }
        getTransform(from, to) {
            const isSmallScreen = window.matchMedia("(max-width: 480px)").matches;
            const isMediumScreen = window.matchMedia("(min-width: 480px)").matches;
            if (isMediumScreen) {
                if (from === 0) return to === 1 ? "translateX(calc(100% + 3vmin))" : to === 2 ? "translateX(calc(200% + 6vmin))" : "translateX(0)"; else if (from === 1) return to === 0 ? "translateX(calc(-100% - 3vmin))" : to === 2 ? "translateX(calc(100% + 3vmin))" : "translateX(0)"; else if (from === 2) return to === 0 ? "translateX(calc(-200% - 6vmin))" : to === 1 ? "translateX(calc(-100% - 3vmin))" : "translateX(0)";
                return "translateX(0)";
            }
            if (isSmallScreen) {
                if (from === 0) return to === 1 ? "translateX(calc(100% + 6vmin))" : to === 2 ? "translateX(calc(200% + 12vmin))" : "translateX(0)"; else if (from === 1) return to === 0 ? "translateX(calc(-100% - 6vmin))" : to === 2 ? "translateX(calc(100% + 6vmin))" : "translateX(0)"; else if (from === 2) return to === 0 ? "translateX(calc(-200% - 12vmin))" : to === 1 ? "translateX(calc(-100% - 6vmin))" : "translateX(0)";
                return "translateX(0)";
            }
        }
        enableItemClick() {
            this.items.forEach((item => {
                if (item) {
                    item.addEventListener("click", this.handleItemClick.bind(this));
                    console.log("Added click listener to:", item);
                }
            }));
        }
        disableItemClick() {
            this.items.forEach((item => {
                if (item) {
                    item.removeEventListener("click", this.handleItemClick.bind(this));
                    console.log("Removed click listener from:", item);
                }
            }));
        }
        handleItemClick(event) {
            console.log("Click event:", event);
            if (this.clickedOnce) return;
            const clickedItem = event.currentTarget;
            if (clickedItem && !clickedItem.classList.contains("item-active")) setTimeout((() => {
                const bonusBall = clickedItem.querySelector(".game__bonus-ball img");
                if (bonusBall) bonusBall.src = this.bonusBigImage;
                clickedItem.classList.add("item-active");
                this.clickedOnce = true;
                console.log("Item clicked:", clickedItem);
            }), 0);
        }
        addChooseItemClass() {
            if (this.gameContainer) {
                this.gameContainer.classList.add("choose-item");
                console.log("Class choose-item added");
            }
        }
    }
    document.addEventListener("DOMContentLoaded", (() => {
        new ShellGame;
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        animationButtonPlay();
        animationThimble();
    }));
    window["FLS"] = true;
})();