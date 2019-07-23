function displayResults(scrapedData) {
    // First, empty the table
    $("tbody").empty();

    // Then, for each entry of that json...
    scrapedData.forEach(function(story) {
        // Append each of the animal's properties to the table
        var tr = $("<tr>").append(
            $("<td>").text(story.title),
            $("<td>").text(story.link),
        );

        $("tbody").append(tr);
    });
}

$.getJSON("/", function(data) {
    // Call our function to generate a table body
    displayResults(data);
});