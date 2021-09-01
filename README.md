<h1 align="center">Medic Schedule Manager - server</h1>
<div align="center">

<img  alt="Typescript" width="50px" src="https://iconape.com/wp-content/png_logo_vector/typescript.png" />
&nbsp;
<img alt="React" width="50px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/react/react.png" />
&nbsp;
<img alt="Node.js" width="50px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/nodejs/nodejs.png" />
&nbsp;
<img alt="PostgreSQL" width="50px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png" />
&nbsp;
<img alt="Amazon Web Services" width="50px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png" />
&nbsp;
<img alt="Git" width="50px" src="https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" />
&nbsp;
<img alt="Visual Studio Code" width="50px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png" />

</div>

> <p align="center"> Technology stack used to build Medic Schedule Manager application. </p>

&nbsp;

## Table of Contents

- [Overview](#overview)
- [Databse](#databse)
- [Authentication](#authentication)
- [Deployment](#deployment)

## Overview

This repository contains backend code for web application [Fizjo-Medyk](https://fizjo-medyk.swidnica.pl). Visit [this repository](https://github.com/Cararr/medic_schedule_manager_client) for more information about the app. The server runs on **Node.js** engine, supplemented with **Express** framework. 100% of application was written with **Typescript** and then compiled to JS. Source file structure consists of 3 layers:

1. Application: Routers and their controllers & middleware. REST API responsible for handling http traffic.
2. Domain: Database's models.
3. Infrastructure: Schedule Generator's logic and app's logger.

## Databse

- DBMS: PostgreSQL
- ORM: [TypeORM](https://typeorm.io/#/)
- Schema: ![image info](./DB_Schema.png)

## Authentication

Server utilize JWT system for user authorization. Tokens are stored inside `token` cookie with 24 hours expiration time.

## Deployment

Application is running on [Amazon EC2](https://aws.amazon.com/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc) Linux instance (Ubuntu 20.04). SSL certificate is provided by Let's Encrypt.

---

> _Visit my [Github](https://github.com/Cararr) account for more or contact me at cararr@tlen.pl!_
