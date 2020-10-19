# koth
King of the hill. See who's code is on top.

KOTH is a monorepo with packages that allows for automated judging of code submissions. Think of it as a set of tools to create a more generalized Hackerrank, Kaggle, Leetcode, etc. Right now, this is pretty integrated with TAMU Datathon 2020 (especially the `@koth/website`) but we will work to make this more integrateable for other people to use.

**Packages:**
 - `@koth/worker`: The queue and worker system. Runs submitted code in a specified [challenge docker container](/challenge-containers) and uses [a customizable evaluator](/worker/src/evaluators) to grade submissions (using stdin and stdout). This was hosted on a docker compose setup on an EC2 instance for TAMU Datathon 2020.
 - `@koth/website`: The frontend and serverless endpoints for users. Lets people submit their code, view their submissions, and the leaderboard. This was hosted on [Vercel](https://vercel.com) for TAMU Datathon 2020. 

<img src="assets/screenshots.png" width="100%" alt="KOTH being used in TAMU Datathon 2020"/>

<p align="center">

<i>KOTH being used in TAMU Datathon 2020</i>

</p>


## Usage
A docker-compose file is provided to setup the whole thing. Make sure to create a `.env` file with fields from `sample.env`.

```bash
$ docker-compose up
# now you should be able to go to http://localhost:3000/koth/
# if you have an gatekeeper admin accessToken cookie you can go to http://localhost:3000/koth/admin/queues
```