# Library Lite

A simple web application for managing a library's books and members.

## Features

- Add books with title, author, and tags (no duplicate titles)
- Add members with first name and last name
- Catalog view: display books, search by title, lend/return books with waitlist
- Members view: display members and their active loans
- Reports view: overdue loans and top books by checkout count
- Populate books from Google Books API by genre

## How to Run

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open http://localhost:5173 in your browser

## Assumptions

- Data is stored in localStorage for simplicity
- Due dates are set to 7 days from lending
- Waitlist is FIFO
- No authentication required
- UI is minimal

## What's Working

- All core requirements implemented
- Data persistence with localStorage
- Basic error handling for duplicate books

## Unit Tests

Run `npm test` to execute the unit tests covering core functionality like adding books, lending, and report generation.
