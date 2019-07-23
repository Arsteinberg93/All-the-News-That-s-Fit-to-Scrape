function displayResults(scrapedData) {

    $("tbody").empty();

    scrapedData.forEach(function(story) {

        var tr = $("<tr>").append(
            $("<td>").text(story.title),
            $("<td>").text(story.link),
        );

        $("tbody").append(tr);
    });
}

$.getJSON("/", function(data) {

    displayResults(data);
});