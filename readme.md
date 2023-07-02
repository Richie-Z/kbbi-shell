# KBBI-Shell

Access KBBI[_Kamus Besar Bahasa Indonesia_] through your shell!
![Screenshoot](https://raw.githubusercontent.com/Richie-Z/kbbi-shell/master/screenshoot/demo.png)

### Requirements

1. Node <= 18.16.0
2. NPM <= 9.5.1

### Installation

Install _kbbi-shell_ globally using npm

    $ npm i kbbi-shell -g

### Development

Git clone this project

    $ git clone https://github.com/Richie-Z/kbbi-shell.git

Run npm install

    $ npm i

Run program by

    $ npm run start

### Usage

    $ kbbi-shell <query>

query is the word you wanna search

#### Available options
|Options| Example  | Description |
|--|--|--|
| -j / --json | kbbi-shell sial -j| output as json |
| -s / --sinonim | kbbi-shell tampan -s| search query sinonim |
| -a / --antonim | kbbi-shell tampan -a| search query antonim |
| -sa / --sinonim_antonim | kbbi-shell sial -sa| search query sinonim and antonim |

#### TODO

- [x] Add _Sinonim_ option
- [x] Add _Akronim_ option
- [ ] Add _EYD_ option
