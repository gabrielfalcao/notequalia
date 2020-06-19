------------------------------------------------------------------------

NoteQualia (cognod.es)
======================

<details>
  <summary>What is Qualia?</summary>
  <img src="qualia.png" alt="Google Search for 'Qualia'" />
</details>


An experimental project with underpinned by ideas from [Evergreen
notes](https://notes.andymatuschak.org/) and [Zettelkasten note-taking
(slip-box)](https://blog.viktomas.com/posts/slip-box/) with
[WriteMapper-like](https://writemapper.com/) experience to visually
navigate note references.

Components in this repo by folder
---------------------------------

-   `frontend` - React App hosted at <https://cognod.es>
-   `notequalia` - Python Restful API for finding word definitions and
    store notes.
-   `operations` - Full infrastructure-as-code that deploys the project
    to kubernetes in digital ocean.
-   `tests` - unit and functional tests for the python code.

Running locally
---------------

### Frontend: React App

TypeScript + React + Redux + Bootstrap with bootswatch theme.

``` {.sourceCode .bash}
cd ./frontend
npm install
npm start
```

### Backend: Python App

Python + PostgreSQL with migrations

``` {.sourceCode .bash}
make db tests run
```
