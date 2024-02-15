const input = document.getElementById("username");

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        letterboxd();
    }
});

function letterboxd() {
    document.querySelector(".movies").innerHTML = "";
    let letterboxdUser = input.value;
    document.title = "letterboxd user: " + letterboxdUser;
    fetch("https://letterboxd.com/" + letterboxdUser + "/rss")
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((data) => {
            const items = data.querySelectorAll("item");

            if (items.length === 0) {
                document.querySelector(".movies").innerHTML = "<span class=\"error\">user not found</span>";
            }

            items.forEach((item) => {
                let title = item.querySelector("title").innerHTML;
                if (title.includes("(contains spoilers)")) {
                    title = title.substring(0, title.indexOf("(contains spoilers)") - 1);
                }
            
                movieTitle = title.split(" - ")[0].substring(0, title.split(" - ")[0].length - 6)
                movieYear = title.split(" - ")[0].substring(title.split(" - ")[0].length - 4, title.split(" - ")[0].length)
                movieRating = title.split(" - ")[1]

                let movieImage = item.querySelector("description").innerHTML;
                movieImage = movieImage.substring(movieImage.indexOf("src=\"") + 5, movieImage.indexOf("\"/>"));

                let movieReview = item.querySelector("description").innerHTML;
                movieReview = movieReview.split("<p>")[2];
                movieReview = movieReview.substring(0, movieReview.indexOf("</p>"));
            
                // if no review was left, letterboxd leaves a "Watched on" message, which I don't want to display
                if (movieReview.includes("Watched on") || movieReview.includes("This review may contain spoilers.")) {
                    movieReview = "";
                }

                // movie div creation and appending
                let movieDiv = document.createElement("div");
                movieDiv.classList.add("movie");
                // movieDiv.style.backgroundImage = "url(" + movieImage + ")";
                movieDiv.innerHTML = 
                        "<div class=\"movie-image\"><img src=\"" + movieImage + "\"></div>" +
                        "<div class=\"movie-info\">" +
                            "<div class=\"movie-title\">" + movieTitle + "</div>" +
                            "<div class=\"movie-year\">" + movieYear + "</div><br>" +
                            "<div class=\"movie-rating\">" + movieRating + "</div>" +
                            "<div class=\"movie-review\">" + movieReview + "</div>" +
                        "</div>";

                document.querySelector(".movies").appendChild(movieDiv);
            });
        })
}

letterboxd();