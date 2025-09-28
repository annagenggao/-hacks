<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<script src="script.js"></script>

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
        wifi: parseFloat(document.getElementById("WiFi?").value),
        outside: parseFloat(document.getElementById("Outside?").value),
        on_campus: parseFloat(document.getElementById("On Campus").value),
        noise: parseFloat(document.getElementById("Noise").value),
        group: parseFloat(document.getElementById("Group?").value),
        coffee: parseFloat(document.getElementById("Coffee").value),
        food: parseFloat(document.getElementById("Food").value),
        outlet: parseFloat(document.getElementById("Outlet Availability").value),
        desk: parseFloat(document.getElementById("Desk").value),
        cozy_or_modern: parseFloat(document.getElementById("Cozy vs. Scholarly").value),
        aesthetic: parseFloat(document.getElementById("Aesthetic Appeal").value),
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

