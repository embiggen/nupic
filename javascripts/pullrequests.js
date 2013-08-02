(function() {
    var OVERDUE_GAP = 7 * 24 * 60 * 60 * 1000;
    var now = new Date().getTime();
    var dataUrl = 'http://issues.numenta.org:8081/prStatus.json?repo=numenta/nupic&callback=?';
    var prTemplate = Handlebars.compile($("#pr-template").html());
    var emptyPrTemplate = Handlebars.compile($("#empty-pr-template").html());
    var $pr = $('#pullrequests');
    $.getJSON(dataUrl, function(prs) {
        $pr.html('');
        if (prs.length) {
            prs.sort(function(a, b) {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }).forEach(function(pr) {
                if ((now - new Date(pr.created_at).getTime()) > OVERDUE_GAP) {
                    pr.overdue = true;
                }
                pr.created_at = pr.created_at.split('T').shift();
                pr.latest_status = pr.statuses[0];
                var html = prTemplate(pr);
                $pr.append(html);
            });
        } else {
            $pr.html(emptyPrTemplate());
        }
    });
}());