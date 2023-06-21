const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

const API = {
  get: [
    {
      endpoint: '/users',
      type: 'JSON',
      resource: 'user/list',
    },
    {
      endpoint: '/users/:id',
      type: 'JSON',
      resource: 'user/id',
    },
  ],
  post: [
    {
      endpoint: '/users',
      type: 'JSON',
      resource: 'user/added',
      hasError: true,
    },
  ],
  put: [
    {
      endpoint: '/user/:id',
      type: 'JSON',
      resource: 'user/put',
    },
  ],
  delete: [
    {
      endpoint: '/user/:id',
      type: 'JSON',
      resource: 'user/delete',
    },
  ],
  patch: [
    {
      endpoint: '/user/:id',
      type: 'JSON',
      resource: 'user/patch',
    },
  ],
};

// if need to run static pages
// app.use(express.static('public'));

app.use(express.json());

app.use(cors());

var methodReqs = ['get', 'post', 'put', 'patch', 'delete'];

async function init() {
  console.log('============== adding endpoints ==============');
  for (var m = 0; m < methodReqs.length; m++) {
    const method = methodReqs[m];
    const methodReq = API[method];

    if (methodReq && methodReq.length > 0) {
      for (i in methodReq) {
        const { resource, endpoint, type, hasError } = methodReq[i];
        console.log({ method: methodReqs[m], resource, endpoint, hasError });
        try {
          const ext = type === 'HTML' ? 'html' : 'json';
          const file = await fs.readFile(`./json/${resource}.${ext}`);
          const data = await file.toString();
          const content = type === 'HTML' ? data : await JSON.parse(data);
          const resp = (req, res) => {
            console.log(req.path, req.params, req.method, hasError);

            if (hasError === true) {
              res.status(500).send(content);
              return;
            }
            if (type === 'JSON') {
              setTimeout(() => {
                res.json(content);
              }, 100);
            } else if (type === 'HTML') {
              setTimeout(() => {
                res.set('Content-Type', 'text/html');
                res.send(content);
              }, 1500);
            } else {
              setTimeout(() => {
                res.set('Content-Type', 'text/xml');
                res.send(content.xml);
              }, 500);
            }
            // MOCK ERRORS
            // res.status(500).send({ error: 'Something failed!' });
            // res.status(404).send({ error: 'Something failed!' });
          };
          if (method === 'get') {
            app.get(endpoint, resp);
          } else if (method === 'post') {
            app.post(endpoint, resp);
          } else if (method === 'put') {
            app.put(endpoint, resp);
          } else if (method === 'patch') {
            app.patch(endpoint, resp);
          } else {
            app.delete(endpoint, resp);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  console.log('============== endpoints added ==============');
}
init();

app.listen(3000, function () {
  console.log('Mock server running on port 3000');
});
