$( document ).ready(function() {
    superplaceholder({
        el: input,
        sentences: [ 'Something to show', 'Another thing to show'],
        options: {
            // delay between letters (in milliseconds)
            letterDelay: 100, // milliseconds
            // delay between sentences (in milliseconds)
            sentenceDelay: 1000,
            // should start on input focus. Set false to autostart
            startOnFocus: true,
            // loop through passed sentences
            loop: false,
            // Initially shuffle the passed sentences
            shuffle: false,
            // Show cursor or not. Shows by default
            showCursor: true,
            // String to show as cursor
            cursor: '|'
        }
    });
});
