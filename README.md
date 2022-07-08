<div id="top">
<br />
<div align="center">
  <a href="https://github.com/Swistu/DC-Recomendation-BOT">
    <img src="https://cdn.discordapp.com/app-icons/971105894886703195/441d22ce53b1ae0947e8236257f60584.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Discord Recommendation Bot</h3>
  <p align="center">
    Bot for promotion system on Discord
    <br />
    <a href="https://github.com/Swistu/DC-Recomendation-BOT/issues">Report Bug</a>
    ·
    <a href="https://github.com/Swistu/DC-Recomendation-BOT/issues">Request Feature</a>
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## About The Project
<div align="center">
  <img src="https://i.ibb.co/X88qVDM/awefawef.png" alt="">
</div>
<br />
The project was created for the clan "Błękitna Armia" playing the game foxhole. 
<br />
<br />
The main goal of the bot is to facilitate the system of promoting players in the clan. The bot itself checks the possibility to give new promotions, the correctness of given recommendations and sets the appropriate roles on the discord server. Most of the data used by the bot is stored in a database set up on mongodb. 

<br />
<br />

### Built With

- [Node.js](https://nodejs.org/)
- [Discord.js](https://discord.js.org/#/)
- [MongoDB](https://www.mongodb.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Create new database at [MongoDB](https://www.mongodb.com/)
* Add new application at [Discord](https://discord.com/developers/applications)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Swistu/DC-Recomendation-BOT.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create `.env` file and set your Database and Discord Bot settings
   ```env
    BOT_TOKEN=BotToken123
    DB_USERNAME=Username
    DB_PASSWORD=Password
    DB_DATABASE=DatabaseName
    DICORD_GUILD_ID=1234567890
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


## Usage

To use any bot command you need to type on any text channel on discord that bot have permission to use. 
After typing `/` on text channel you should see all avaible commands.

Command list `/`
<br />
<br />
<img src="https://i.ibb.co/mSqDpQr/coommandlist.png" alt="">
<br />
<br />
Checking player information `/gracz pokaż`
<br />
<br />
<img src="https://i.ibb.co/XX5gDt1/botaaa.png" alt="">
<br />
<br />
Adding new recommendation `/rekomendacje dodaj`
<br />
<br />
<img src="https://i.ibb.co/SycQtBJ/daaa.png" alt="">

<p align="right">(<a href="#top">back to top</a>)</p>



## Roadmap

- [ ] Automated Backup to text channel on discord
- [ ] Saving information about previous player promotion

See the [open issues](https://github.com/Swistu/DC-Recomendation-BOT/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>


## License
Distributed under the MIT License. See `LICENSE.txt` for more information.
<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Szymon Świst - <a href="mailto:szymonswist97@gmail.com">szymonswist97@gmail.com</a>

Project Link: [https://github.com/Swistu/DC-Recomendation-BOT](https://github.com/Swistu/DC-Recomendation-BOT)

<p align="right">(<a href="#top">back to top</a>)</p>
