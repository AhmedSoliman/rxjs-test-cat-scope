var $input = $('#search'),
    $results = $('#results'),
    $counter = $('#count'),
    $spinner = $('#spinner');

var queries = Rx.Observable.fromEvent($input, 'keyup')
                .map(e => e.target.value)
                .filter(text => text.length > 2)
                .debounce(500)
                .distinctUntilChanged()

function searchWikipedia (term) {
  console.log("Querying the term %s", term)
  $spinner.removeClass('hidden');
  return $.ajax({
    url: 'http://en.wikipedia.org/w/api.php',
    dataType: 'jsonp',
    data: {
      action: 'opensearch',
      format: 'json',
      search: term
    }
  }).promise();
}

function showResults(data) {
  var entries = data[1].map(
    (e, i) =>
      '<div class="col-md-6"><h3><a href="'+ data[3][i] +'">' + data[1][i] + '</a></h3><div>' + data[2][i] + '</div></div>'
    )
  $results
    .empty()
    .append(entries);
}


var suggestions = queries.flatMapLatest(searchWikipedia).share()


suggestions.subscribe(data => $spinner.addClass('hidden'));

suggestions.subscribe(data => $counter.text("Results: " + data[1].length));

suggestions.subscribe(
    data => showResults(data)
  ,
    error =>
      $results
        .empty()
        .append($('<div>').text('Error:' + error))
  );











