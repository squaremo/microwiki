var http = require('http');
var os = require('os');
var urlparse = require('url').parse;
var qsparse = require('querystring').parse;

var pages = {};

function handle(req, res) {
    var parts = urlparse(req.url);
    var name = parts.pathname.substr(1);
    if (req.method == "GET") {
        var content = pages[name];
        if (content == undefined) {
            res.writeHeader(200);
            res.write("<h1>Unknown page</h1>")
            writeForm(res, name, "");
            endWithFooter(res);
        }
        else {
            res.writeHeader(200);
            res.write("<h1>" + (name || "Home") + "</h1>");
            res.write(content);
            writeForm(res, name, content);
            endWithFooter(res);
        }
    }
    else if (req.method == "POST") {
        readAll(req, function(err, buf) {
            if (err != null) {
                res.writeHeader(500);
                res.end(err.toString());
            }
            else {
                var form = qsparse(buf.toString('utf8'));
                pages[name] = form['content'];
                res.writeHeader(303, {'Location': '/'+name});
                res.end('Success! Now go to /' + name);
            }
        });
    }
    else {
        res.writeHeader(405);
        res.end("Nothing but GET and POST please");
    }
}

function writeForm(res, name, content) {
    res.write('<hr/>');
    res.write('<form method="POST"><textarea name="content">' +
              content +
              '</textarea><input type="submit"/></form>');
}

function endWithFooter(res) {
    res.write('<hr/>');
    res.end('Generated on host ' + os.hostname());
}

function readAll(req, kont) {
    var bufs = [];
    req.on('data', bufs.push.bind(bufs));
    req.on('end', function() {kont(null, Buffer.concat(bufs));});
    req.on('error', kont);
}

http.createServer(handle).listen(process.env['HTTP_PORT'] || 80);
