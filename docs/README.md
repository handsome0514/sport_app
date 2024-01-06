# Mobile & Web app that allows players to arrenge tournaments to pick the winners.

## General notes:

- Comment and clean code, commit, for now you can push directly.
- Run the app locally but if you needed to run it GCP, Always remember to destroy resources if you used GCP, you can get the credentials from Hooshyar
- Main focus is the web for now
- Issues need to be reported to Farzad
- You will have direct access to the project coordinator, if something is not clear as Him directly

Done already:

- [x] Responsive web app and mobile MVP on expo go
- [x] User can signup
- [x] User can create a tournament
- [x] Guest users can be added to tournaments
- [x] Tournament generates a code and can be found using search feature
- [x] Tournament rules are rules of Subsoccer and chart explains the winner of tournament

To be fixed:

- [x] User should be able to join tournament as logged in user
- [x] Mistakenly added goals can not be deleted on mobile(CHECK IF TRUE ON WEB)
- [x] Web and mobile UI should have same layout(RESPONSIVE DESIGN ISSUE)
- [x] Tournament chart should include selection for auto refresh when it´s displayed on external display
- [x] Social media sharing works only on http, should work on https

To do:

- [x] Remove “play again” button after played tournament and show only “New tournament”
- [x] Add a page for Terms of Use and add terms on it (Lorem ipsum as a placeholder)
      BLOCKED - [ ] Publish mobile apps for iOS and Android platforms
- [ ] Add automatic backups for user data and possibility to restore backup or at least instructions how to
- [ ] Create init-script for installation of the software on cloud environment, now done manually
- [ ] Create admin user interface to manage users, tables, groups and tournaments. Should allow delete/hide all the above.
- [ ] Add user categories: player, star player, celebrity, tournament creator, official tournament creator, moderator, admin
- [ ] Add a possibility to include and list prizes for tournaments.
- [ ] Identifying occurrence. Each gaming event will get a unique ID to combine time, location, tournament, table and player1 vs. Player2
- [ ] Add a possibility to create a local tournament as public (Official) tournaments or hidden (invitation only)

TABLE LOG RELATED

CLARIFICATIONS NEEDED - [ ] Add a possibility to register games (tables) with unique ID, so that the location of each table is in databasetournament-app.
CLARIFICATIONS NEEDED - [ ] Add a possibility to browse gaming history. From the collected data mentioned above will start forming history for tables and for players. Player should be able to browse when, where and with whom he/she has played before.
CLARIFICATIONS NEEDED - [ ] Admins should be able to browse who has played using specific table and which tournaments has been played with the table.

---

### Tech Stack

1. Backend mostly Express, GCP powering the mobile and web app (Terraform for configurations)
2. Mobile app for both Android and iOS (Expo platform ,Typescript, react native)
3. Web app (ReactJs written in TypeScript)

### Mobile/Web app user types

1. A user creating a tournament
2. A user browsing tournaments nearby
3. A user browsing tournaments and games he/she has participated in with stats
4. A table owner browsing which tournaments are planned to be held on his/her table
5. A tournement organizer browsing tournaments he/she has created and upcoming tournaments 6. A Subsoccer company representative browsing all registered tables with locations

### User Journeys

1. Login/Signup journey
2. Creating a tournament journey
3. Browsing tournaments journey
4. Browsing created tournaments journey
5. Browsing tournaments held on my own table journey
6. Browsing official tournaments already held or upcoming tournaments journey 7. Browsing all registered tables with locations journey

### Full documentation

project_subsoccer_tournament_break_down.pdf

### UI

https://www.figma.com/proto/VfGPSO49LzauSTon4Nq0yW/subsoccer-La-Liga?node-id=1111%3A8264&starting-point-node-id=1111%3A8264

### Database (development)

Connection String:
mongodb+srv://datacode:DaTCD10Tor@tournament.yxdsoyv.mongodb.net/?retryWrites=true&w=majority
