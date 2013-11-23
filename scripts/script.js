(function () {
    if (!Storage.prototype.setObject) {
        Storage.prototype.setObject = function (key, obj) {
            this.setItem(key, JSON.stringify(obj));
        }
    }

    if (!Storage.prototype.getObject) {
        Storage.prototype.getObject = function (key) {
            return JSON.parse(this.getItem(key));
        }
    }
}());

(function () {
    var TOTAL_TRASHES = 10;
    var NUMBER_TOP_SCORES = 5;
    var startTime = new Date();
    var itemsCount = 0;

    // Create main div container
    var container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);
    createStratScreen();
        
    function createStratScreen() {
        localStorage.getObject("scoreboard");
        // Create start button
        var startBtn = document.createElement("div");
        startBtn.innerHTML = "<a href=\"#\">New Game</a>";
        startBtn.id = "start-btn";
        container.appendChild(startBtn);

        if (startBtn.addEventListener) {
            startBtn.addEventListener("click", startGame, false);
        } else {
            startBtn.attachEvent("onclick", startGame);
        }

        // Create scoreboard button
        var scoreBtn = document.createElement("div");
        scoreBtn.innerHTML = "<a href=\"#\">Scoreboard</a>";
        scoreBtn.id = "score-btn";
        container.appendChild(scoreBtn);

        // TODO: on second click not to display twice
        if (scoreBtn.addEventListener) {
            scoreBtn.addEventListener("click", displayTopScores, false);
        } else {
            scoreBtn.attachEvent("onclick", displayTopScores);
        }
    }

    function startGame() {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        addBucket();
        for (var i = 0; i < TOTAL_TRASHES; i++) {
            addTrash();
        }
        startTime = new Date();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function addBucket() {
        var bucket = document.createElement("img");
        bucket.src = "imgs/Bucket.png";
        bucket.id = "bucket";
        container.appendChild(bucket);

        bucket.style.position = "absolute";
        bucket.style.top = getRandomInt(0, 280) + "px";
        bucket.style.left = getRandomInt(0, 520) + "px";
        

        if (bucket.addEventListener) {
            bucket.addEventListener("drop", dropItem, false);
        } else {
            bucket.attachEvent("ondrop", dropItem);
        }

        if (bucket.addEventListener) {
            bucket.addEventListener("dragover", allowDropItem, false);
        } else {
            bucket.attachEvent("ondragover", allowDropItem);
        }

        if (bucket.addEventListener) {
            bucket.addEventListener("dragleave", restoreState, false);
        } else {
            bucket.attachEvent("ondragleave", restoreState);
        }
    }

    function createTrash() {
        var item = document.createElement("img");
        item.id = "item" + (itemsCount - 1);
        item.src = "imgs/trash.png";
        item.className = "trash";
        item.setAttribute("draggable", "true");

        item.style.position = "absolute";
        item.style.top = getRandomInt(0, 430) + "px";
        item.style.left = getRandomInt(0, 590) + "px";

        if (item.addEventListener) {
            item.addEventListener("dragstart", dragItem, false);
        } else {
            item.attachEvent("ondragstart", dragItem);
        }

        return item;
    }

    function addTrash() {
        itemsCount++;
        var trash = createTrash();
        container.appendChild(trash);
    }

    function dragItem(event) {
        if (!event) {
            event = window.event;
        }
        var eventSource = (event.target ? event.target : event.srcElement);

        event.dataTransfer.setData("dragged-item-id", eventSource.id);
    }

    function dropItem(event) {
        if (!event) {
            event = window.event;
        }
        if (event.preventDefault) {
            event.preventDefault();
        }

        var eventSource = (event.target ? event.target : event.srcElement);
        var itemId = event.dataTransfer.getData("dragged-item-id");
        var item = document.getElementById(itemId);
        item.parentElement.removeChild(item);
        eventSource.src = "imgs/Bucket.png";

        itemsCount--;

        if (itemsCount === 0) {
            finishGame();
        }
    }

    function allowDropItem(event) {
        if (!event) {
            event = window.event;
        }

        var eventSource = (event.target ? event.target : event.srcElement);
        eventSource.src = "imgs/Bucket-open.png";

        if (event.preventDefault) {
            event.preventDefault();
        }
    }

    function restoreState(event) {
        if (!event) {
            event = window.event;
        }

        var eventSource = (event.target ? event.target : event.srcElement);
        eventSource.src = "imgs/Bucket.png";

        if (event.preventDefault) {
            event.preventDefault();
        }
    }

    function finishGame() {
        var endTime = new Date();

        var milliseconds = endTime.getTime() - startTime.getTime();
        var score = milliseconds / 1000;
        var nickname = prompt("Please enter your name");
        localStorage.setItem(nickname ? nickname : "anonymous", score);

        if (localStorage.length > NUMBER_TOP_SCORES) {

            var worstScore = 0;
            var worstNickname;
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
                var value = Number(localStorage.getItem(key));

                if (value > worstScore) {
                    worstScore = value;
                    worstNickname = key;
                }
            }

            localStorage.removeItem(worstNickname);
            
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            createStratScreen();
            displayTopScores();
        }
    }

    function displayTopScores() {
        var localStorageArray = [];

        if (localStorage.length && localStorage.length > 0) {

            for (var i = 0; i < localStorage.length; i++) {

                var key = localStorage.key(i);
                var value = Number(localStorage.getItem(key));

                localStorageArray.push({ key: key, value: value });
            }

            localStorageArray.sort(function (kvp1, kvp2) {
                return kvp1.value - kvp2.value;
            });
        }

        var table = document.createElement("table");
        
        for (var j = 0; j < localStorageArray.length; j++) {

            var row = document.createElement("tr");
            row.innerHTML =
                "<td><strong>" + (j+1) + ". " + localStorageArray[j].key + "</strong></td>" +
                "<td>" + localStorageArray[j].value + "</td>";
            table.appendChild(row);
            //document.cookie = localStorageArray[j].key = localStorageArray[j].value; 'expires=Fri, 2 Aug 2013 20:47:11 UTC; path=/'
        }

        container.appendChild(table);
        
    }
})();