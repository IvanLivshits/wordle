"use strict"

import { words } from "./words.js";

const numberOfGuesses = 6;
let guessesRemaining = numberOfGuesses;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = words[Math.floor(Math.random() * words.length)];
console.log(`Right word = ${rightGuessString}`)

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < numberOfGuesses; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

initBoard();

document.addEventListener("keydown", (e) => {

    if (guessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key)

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z]/gi)

    if (!found || found.length > 1) {
        return;
    } else {
        insertLetter(pressedKey);
    }
})

function insertLetter(pressedKey) {

    if (nextLetter === 5) {
        return;
    }

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter];

    box.textContent = pressedKey
    box.classList.add("filled-box");

    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function deleteLetter() {

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box")
    currentGuess.pop();
    nextLetter -= 1
}

function checkGuess() {

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
    let guessString = '';
    let rightGuess = Array.from(rightGuessString);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != 5) {
        toastr.error("Введены не все буквы!");
        return;
    }

    if (!words.includes(guessString)) {
        toastr.error("Такого слова нет в списке!");
        return;
    }

    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }

        box.style.backgroundColor = letterColor;
    }

    if (guessString === rightGuessString) {
        toastr.success("Вы выиграли!")
        guessesRemaining = 0;
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("У вас не осталось попыток. Вы проиграли!");
            toastr.info(`Загаданное слово: "${rightGuessString}"`)
        }
    }
}