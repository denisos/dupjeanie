
// this article was a big help to understand how to structure the node.io, 
// scroll about half way down for the goodness
//  https://github.com/chriso/node.io/issues/29
//
// 
var nodeio = require('node.io');

var methods = {
    // these are the urls to start with, could also be read from a file
    input: [
        { type: 'initial', url: 'http://www1.macys.com/shop/catalog/product/thumbnail/1?edge=hybrid&limit=none&suppressColorSwatches=false&categoryId=11221&ids=11221_632323,11221_619669,11221_619674,11221_632326,11221_696881,11221_632321,11221_696875,11221_632330,11221_761461,11221_761456,11221_761454,11221_747773,11221_761465,11221_761453,11221_761457,11221_747765,11221_761478,11221_761477,11221_761476,11221_761464,11221_761460,11221_761479,11221_761463' },
        { type: 'initial', url: 'http://www1.macys.com/shop/catalog/product/thumbnail/1?edge=hybrid&limit=none&suppressColorSwatches=false&categoryId=11221&ids=11221_632302,11221_613985,11221_577891,11221_704830,11221_703135,11221_577899,11221_696859,11221_635975,11221_577892,11221_704832,11221_696874,11221_406138,11221_695845,11221_454016,11221_747761,11221_632289,11221_613983,11221_632316,11221_715741,11221_696850,11221_696728,11221_747770,11221_614001,11221_632313,11221_715742,11221_696861,11221_734491,11221_705567,11221_632327,11221_632317,11221_521820,11221_704835,11221_696719,11221_695841,11221_632318,11221_696867,11221_695842,11221_572593,11221_632301,11221_479575,11221_316430,11221_696721,11221_696873,11221_632304,11221_577908,11221_632288,11221_406134,11221_254674,11221_696727,11221_592354,11221_406142,11221_696877,11221_632291,11221_632293,11221_696856,11221_665099,11221_696849,11221_696722,11221_632320,11221_696726,11221_747762,11221_696866,11221_696862,11221_665103,11221_747763,11221_696848,11221_696860,11221_696868,11221_528297,11221_613984,11221_696855,11221_608732,11221_695837,11221_632315,11221_603976,11221_715743,11221_619668,11221_704833,11221_592358,11221_696847,11221_696852,11221_577905,11221_632322,11221_696869,11221_632319,11221_696846,11221_635976,11221_696723,11221_695838,11221_603977,11221_696870,11221_577889,11221_704834,11221_619670,11221_632324,11221_592357,11221_696879,11221_696880,11221_695839,11221_696878' }        
    ],
    run: function(input) {
        var self = this,
            hostname = "http://www1.macys.com",
            sizes,
            $set,
            product,
            productsList = [];


        if (input.type === 'initial') {

            // for each input url, get the page
            //    find all the links within it matching the selector
            //      and add then to self as input (to be processed in the else if)
            //
            this.getHtml(input.url, function (err, $) {

                // if error then bail
                if (err) this.exit(err);


                $('.shortDescription  a').each(function(a) {

                    // add a url to the input list but make the type 'subrequest'
                    self.add({ type: 'subrequest', url: hostname + a.attribs.href, title: a.text});

                });

                this.skip();

            });
        } else {
            // these must be urls which were added dynamically as 'subrequest'
            //
            product = {title: input.title,
                       url: input.url};

            this.getHtml(input.url, function (err, $) {
                //Parse your subrequests here..

                sizes = [];

                //console.log("inside html returned");

                // if error then bail
                if (err) self.exit(err);

                $set = $('ul.sizes li span');
                if ($set) {

                    //console.log("$set is: ", $set);

                    // handle case of only 1 size
                    if ($set.length <= 1) {
                        sizes.push($set.text);
                            
                    } else {
                        if ($set.each) { 
                            // more than one size
                            $set.each(function(span) {
                                //console.log("Link text is: ", a.text, hostname, a.attribs.href)

                                sizes.push(span.text); 

                            });
                        }
                    }

                    product.sizes = sizes;

                    productsList.push(product);

                }

                // emit stops the node.io job and cals to getHtml() are asynch so 
                //  must put emit here
                //
                this.emit(productsList);
            });
        }
    }
}


exports.job = new nodeio.Job({timeout:20}, methods);
