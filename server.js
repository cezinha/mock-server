var express = require('express');
var app = express();

var login = require("./json/login/index.json");
var refresh = require("./json/login/refresh.json");
var login_facebook = require("./json/login/facebook.json");
var login_checkdocument = require("./json/login/check-document.json");
var event = require("./json/event/event_active.json");
var event_detail = require("./json/event/event_detail.json");
var ticket_list_accesspoint = require("./json/ticket/ticket_list_accesspoint.json");
var ticket_select_accesspoint = require("./json/ticket/ticket_select_accesspoint.json");
var ticket_select_item = require("./json/ticket/ticket_select_item.json");
var ticket_read_qr_used = require("./json/ticket/ticket_read_qr_used.json");
var ticket_read_qr_transfered = require("./json/ticket/ticket_read_qr_transfered.json");
var ticket_read_qr_created = require("./json/ticket/ticket_read_qr_created.json");
var ticket_consume = require("./json/ticket/ticket_consume.json");
var ticket_query_ticket_by_cpf = require("./json/ticket/ticket_query_ticket_by_cpf.json");
var ticket_query_by_cpf_or_qrcode = require("./json/ticket/ticket_query_by_cpf_or_qrcode.json");
var payment_qrcode = require("./json/payment/qrcode.json");
var partner = require("./json/partner/partner_list.json");

app.use(function(req, res, next) {
  // check for .xls extension
  console.log(req.originalUrl);
  next();
}, express.static('public'));

//app.use(express.static('public'));

app.use(express.json());
app.post('/apimobile/v1/requests', function(req, res) {
  console.log(req.body);
  if (req.body.type) {
    if (req.body.type == "check_document") {
      //res.status(400).send({ message: 'Bad Request', status: 400 });
      res.json(login_checkdocument);

      return ;
    }
    if (req.body.type == "login") {
      if (req.body.subtype == "refresh_login") {
        //res.status(401).send({ message: 'Unauthorized', status: 401 });
        res.json(refresh);

        return ;
      }
      //res.status(401).send({ message: 'Unauthorized', status: 401 });
      res.json(login);

      return ;
    }
    if (req.body.type == "facebook") {
      res.json(login_facebook);

      return ;
    }
    if (req.body.type == "partner") {
      res.json(partner);

      return ;
    }
    if (req.body.type == "event") {
      if (req.body.subtype == "detail") {
        res.json(event_detail);
        //res.status(400).send({ message: 'Bad Request' });
        return ;
      }
      res.json(event);
      //res.status(401).send({ message: 'Unauthorized' });
      return ;
    }
    if (req.body.type == "ticket") {
      if (req.body.subtype == "list_accesspoint") {
        res.json(ticket_list_accesspoint);
        //res.status(401).send({ message: 'Unauthorized' });
        return ;
      }

      if (req.body.subtype == "select_item") {
        res.json(ticket_select_item);
        return ;
      }

      if (req.body.subtype == "query_by_cpf_or_qrcode") {
        res.json(ticket_query_by_cpf_or_qrcode);

        return;
      }

      if (req.body.subtype == "read_qrcode") {
        res.json(ticket_read_qr_created);
        return ;
      }

      if (req.body.subtype == "consume_restore_ticket") {
        res.json(ticket_consume);

        return;
      }

      if (req.body.subtype === "query_ticket_by_cpf") {
        res.json(ticket_query_ticket_by_cpf);

        return;
      }
      // select_accesspoint
      res.json(ticket_select_accesspoint);
      //res.status(401).send({ message: 'Unauthorized' });
      return ;
    }

    if (req.body.type == "refresh") {
      res.json(login);
      return ;
    }

    if (req.body.type == "qrcode") {
      res.json(payment_qrcode);
      //res.status(500).send({ error: 'Something failed!' });
      //res.status(401).send({ message: 'Unauthorized' });
      return ;
    }
  }
  res.status(500).send({ error: 'Something failed!' });
});

app.listen(3000, function () {
  console.log('Mock server running on port 3000');
});
