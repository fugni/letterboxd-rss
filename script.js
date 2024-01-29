const letterboxdUser = "flungi";
document.title += letterboxdUser;

fetch("https://letterboxd.com/" + letterboxdUser + "/rss")
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
        const items = data.querySelectorAll("item");
        console.log(items);

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

            // movie div creation and appending
            let movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");
            movieDiv.style.backgroundImage = "url(" + movieImage + ")";
            movieDiv.innerHTML = 
                "<div class=\"movie-title-div\">" +
                    "<div class=\"movie-title\">" + movieTitle + "</div>" +
                    "<div class=\"movie-year\">" + movieYear + "</div>" +
                "</div>" +
                "<div class=\"movie-rating\">" + movieRating + "</div>";
            document.querySelector(".movies").appendChild(movieDiv);
        
        });
    })