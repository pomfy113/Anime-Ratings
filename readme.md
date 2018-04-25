# OurAnimeChart
## Status & Todo - **HIATUS + CLEAN-UP**
Need to do some refactoring and cleaning up code. Managed to get in just in time for a fair; now to make sure that it's easy to maintain for future features. Not going to make new features

## About
This project was originally made to consolidate all the information from several anime information sites at once. Now it's more for ease of finding what's worth looking into season per season.

### Why?
Mostly for my and my Discord groups' convenience. We were tired of looking at multiple sites and clicking through everything just to find out what's worth looking into that season. I asked them what features they wanted the most, and made their wants a reality.

### What can it do?
- Display anime per season with studios and ratings
- Display each anime's synopsis, trailer, and airing dates
- Link directly to episode, character, and voice actor data
- Link directly to a legal stream
- Move directly to sequels, prequels, adaptation, spin-offs, and all other related anime
- Search by genre, studio, and name instantly
- Save favorites

## Getting Started
### Accessing the Site
The project is up and running at Heroku! If you would like to visit it, [click this link](http://ouranimechart.herokuapp.com/). Because of how Heroku works, please allow some time for the site to get up and running.

### Prerequisites
Most of the things needed should be in the folder already. If you have any issues, please feel free to contact me

### Running Locally
To get it running on your local device, all you need to do is:
1. Go to your terminal
2. Head to where you put the folder in
3. Use `npm install` to install dependencies  if needed
4. Run `node app.js` on the terminal
5. Open `localhost:3000`

And voila! You're good to go

## Info
### Currently using
- [Node.js](https://nodejs.org/en/) + [Express](https://expressjs.com/)
- [React](https://reactjs.org/) - For front-end
- [MAL Scraper](https://www.npmjs.com/package/mal-scraper) - For seasonal MAL info; may be phased out
- [Anilist API](https://anilist.gitbooks.io/anilist-apiv2-docs/) - For detailed Anilist info (Using GraphQL)
- [Jikan](https://jikan.me/docs) - For detailed MAL info


### Previously built with
- [Handlebars](http://handlebarsjs.com/) for templating
- [Bootstrap](https://getbootstrap.com/) for styling; switched to CSS
- [MongoDB](https://www.mongodb.com/) as database; switched to using local storage
- [Kitsu API](https://www.npmjs.com/package/kitsu)
- [Popura API](https://www.npmjs.com/package/popura)

## Author
* **Ferdinand Cruz** - everything so far!
