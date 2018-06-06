import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';

import env from './config/env';
import routes from './routes';
import fileUpload from 'express-fileupload';

// import ejs  from 'ejs';
// import stream  from 'express-stream';
// import superagent  from 'superagent';

import videoStream from 'video-stream';



const app = express();
app.use(fileUpload());

/*==================================
=            Middleware            =
==================================*/
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(helmet()); // Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(compression());
app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// serve static files, this is for frontend React
app.use('/static', express.static(path.join(__dirname, 'public', 'static')));

/*=====  End of Middleware  ======*/

/*===========================================
=            Baic Authentication            =
===========================================*/

// app.use(require('node-basicauth')({'haochuan': 'password'}));

/*=====  End of Baic Authentication  ======*/

/*===========================
=            COR            =
===========================*/

// app.use(require('cors')());

/*=====  End of COR  ======*/

// Routes
app.use('/api/v1', routes.api_v1);
app.use('/page', routes.page);


// video-stream route
app.get('/video/:filename', videoStream({ dir: path.resolve(__dirname, 'uploadedfiles') }));

app.put('/uploadFiles', function (req, res) {
  // console.log(req.files);
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  var obj = req.files;
  var arr = Object.keys(obj).map((key) => obj[key]);

  for (let i = 0; i < arr.length; ++i) {
    let file = arr[i]
    file.mv(path.join(__dirname, 'uploadedfiles', file.name), function (err) {
      if (err)
        return res.status(500).send(err);

      console.log(file.name + ' File uploaded!');
    });
  }

  res.send('ok');
});


// Load React App
// Serve HTML file for production
if (env.name === 'production') {
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

export default app;
