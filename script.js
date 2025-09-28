let studySpots = [];
Papa.parse("study_spots.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        studySpots = results.data;
    }
})

//Form submission
document.getElementById("quiz").onsubmit = function(e) {
    e.preventDefault();

    const userAnswers = {
        wifi: parseFloat(document.getElementById("wifi").value),
        outside: parseFloat(document.getElementById("outside").value),
        on_campus: parseFloat(document.getElementById("on_campus").value),
        noise: parseFloat(document.getElementById("noise").value),
        group: parseFloat(document.getElementById("group").value),
        coffee: parseFloat(document.getElementById("coffee").value),
        food: parseFloat(document.getElementById("food").value),
        outlet: parseFloat(document.getElementById("outlet").value),
        desk: parseFloat(document.getElementById("desk").value),
        cozy_or_modern: parseFloat(document.getElementById("cozy_or_modern").value),
        aesthetic: parseFloat(document.getElementById("aesthetic").value),
    };

    const topSpots = findBestSpots(studySpots, userAnswers);

    
};

//Scores individual study spots
function scoreSpot(spot, userAnswers) {
    const scores = [];

    for (let key in userAnswers) {
        if (userAnswers.hasOwnProperty(key) && spot.hasOwnProperty(key)) {
            const userValue = userAnswers[key];
            const spotValue = spot[key];

            // Example: closer values = better score
            const diff = Math.abs(userValue - spotValue);
            const maxVal = Math.max(userValue, spotValue, 1); 
            const similarity = 1 - (diff / maxVal); 
            scores.push(similarity);
        }
    }
    const total = scores.reduce((sum, s) => sum + s, 0);
    return scores.length > 0 ? total / scores.length : 0;
    
}

function findBestSpots(spots, userAnswers) {
    const scoredSpots = spots.map(spot => ({
        spot,
        score: scoreSpot(spot, userAnswers)
    }));
    //The key becomes the spot and the value becomes the score

    //Scores in reverse order
    scoredSpots.sort((a, b) => b.score - a.score);

    const bestSpot = scoredSpots[0].spot;
    const secondBest = scoredSpots[1].spot;
    const thirdBest = scoredSpots[2].spot;

    return [bestSpot, secondBest, thirdBest];
}

function showResults(spots) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <ol>
            ${spots.map(s => `<li>${s.name}</li>`).join("")}
        </ol>
    `;
}

