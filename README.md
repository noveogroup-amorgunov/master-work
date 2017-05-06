# Sci-permute project

<p align="left">
   <a href="https://github.com/airbnb/javascript">
    <img src="https://camo.githubusercontent.com/1c5c800fbdabc79cfaca8c90dd47022a5b5c7486/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d616972626e622d627269676874677265656e2e7376673f7374796c653d666c61742d737175617265"
         alt="Standart" />
  </a> 
</p>

## Install

```shell
$ npm install
$ npm install nodemon webpack -g
```

Change `.env` config file (`PROXY` - address of server which I used as `ngrok`).

Change `window.config` in `app/index.jsx`.

```shell
$ npm run build # build client-side bundle
$ npm strt # run server from nodemon
```

```shell
$ ngrok http 4017 # ngrok.exe http 4017
```