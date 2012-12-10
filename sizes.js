
var nodeio = require('node.io');

var methods = {
    input: ["http://www1.macys.com/shop/product/levis-jeans-514-slub-twill-straight-blue-bird-jeans?ID=761463&CategoryID=11221&LinkType="
],
    run: function (url) {

        this.getHtml(url, function(err, $) {
            var sizes = [];

            console.log("inside html returned")

            // if error then bail
            if (err) this.exit(err);

          //  this.emit($('body'));


            $('ul.sizes li span').each(function(span) {
//console.log("Link text is: ", a.text, hostname, a.attribs.href)

                sizes.push(span.text); 

            });


            this.emit(sizes);

        });
    }
}

exports.job = new nodeio.Job({timeout:20}, methods);