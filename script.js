const results = document.querySelector(".results");
const input = document.getElementById("username");
input.value = "flungi";
let username = input.value;

input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        letterboxd();
    }
});

let movies = [];

let i = 0;

function letterboxd() {
    results.innerHTML = "";
    movies = [];
    username = input.value;

    fetch("https://letterboxd.com/" + username + "/rss")
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((data) => {

            const items = data.querySelectorAll("item");
            console.log(items);

            items.forEach((item) => {
                console.log(item);
                if (item.innerHTML.includes("letterboxd-list-")) {
                    return;
                } else {
                    let userReview = item.querySelector("description").innerHTML.split("<p>")[2].substring(0, item.querySelector("description").innerHTML.split("<p>")[2].indexOf("</p>"));
                    if (userReview.includes("Watched on")) {
                        userReview = "";
                    } else if (userReview.includes("This review may contain spoilers.")) {
                        userReview = item.querySelector("description").innerHTML.split("<p>")[3].substring(0, item.querySelector("description").innerHTML.split("<p>")[3].indexOf("</p>"));
                    };

                    let tmdbID;
                    let type;
                    try {
                        tmdbID = item.querySelector("movieId").innerHTML;
                        type = "movie";
                    } catch (error) {
                        tmdbID = item.querySelector("tvId").innerHTML;
                        type = "tv";
                    }


                    // turn the movie into an object
                    const movie = {
                        // movie information
                        title: item.querySelector("filmTitle").innerHTML,
                        year: item.querySelector("filmYear").innerHTML,
                        image: item.querySelector("description").innerHTML.substring(item.querySelector("description").innerHTML.indexOf("src=\"") + 5, item.querySelector("description").innerHTML.indexOf("\"/>")),
                        tmdbID: tmdbID,
                        type: type,
                        // user information
                        user: item.querySelector("creator").innerHTML,
                        userRating: item.querySelector("memberRating").innerHTML,
                        userRatingStars: item.querySelector("title").innerHTML.split(" - ")[1],
                        userReview: userReview,
                        userReviewDate: item.querySelector("pubDate").innerHTML,
                        userReviewLink: item.querySelector("link").innerHTML,
                        userWatchedDate: item.querySelector("watchedDate").innerHTML,
                        userRewatch: item.querySelector("rewatch").innerHTML,
                    };

                    movies.push(movie);
                }
            });

            const randomness = Math.floor(Math.random() * movies.length);
            const randomMovie = movies[randomness];

            results.innerHTML += "<span>random movie from " + username + "'s letterboxd rss:</span>";

            // console.log(items[Math.floor(Math.random() * movies.length)]);
            const oldResultDiv = document.createElement("code");
            oldResultDiv.classList.add("code");
            oldResultDiv.textContent = items[randomness].outerHTML;
            oldResultDiv.innerHTML += "<br><br>";
            results.appendChild(oldResultDiv);

            results.innerHTML += "<span>converted to js object:</span>";

            const resultDiv = document.createElement("code");
            resultDiv.classList.add("code");
            resultDiv.textContent =
                "const movie = {\n" +
                "    image: \"" + randomMovie.image + "\",\n" +
                "    tmdbID: \"" + randomMovie.tmdbID + "\",\n" +
                "    title: \"" + randomMovie.title + "\",\n" +
                "    type: \"" + randomMovie.type + "\",\n" +
                "    user: \"" + randomMovie.user + "\",\n" +
                "    userRating: \"" + randomMovie.userRating + "\",\n" +
                "    userRatingStars: \"" + randomMovie.userRatingStars + "\",\n" +
                "    userReview: \"" + randomMovie.userReview + "\",\n" +
                "    userReviewDate: \"" + randomMovie.userReviewDate + "\",\n" +
                "    userReviewLink: \"" + randomMovie.userReviewLink + "\",\n" +
                "    userRewatch: \"" + randomMovie.userRewatch + "\",\n" +
                "    userWatchedDate: \"" + randomMovie.userWatchedDate + "\",\n" +
                "    year: \"" + randomMovie.year + "\",\n" +
                "};\n\n";
            results.appendChild(resultDiv);
        });
};

letterboxd();