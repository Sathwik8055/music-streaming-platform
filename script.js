const tracks = [
    ["Neon Rush", "Electronic", "01 - Neon Rush.mp3"],
    ["Midnight Drive", "Synthwave", "02 - Midnight Drive.mp3"],
    ["Electric Pulse", "EDM", "03 - Electric Pulse.mp3"],
    ["Skyline", "Chill Electronic", "04 - Skyline.mp3"],
    ["Afterglow", "Ambient", "05 - Afterglow.mp3"],
    ["Velocity", "Dance", "06 - Velocity.mp3"],
    ["City Lights", "Synth Pop", "07 - City Lights.mp3"],
    ["Thunder Run", "Drum & Bass", "08 - Thunder Run.mp3"],
    ["Ocean Motion", "Chill", "09 - Ocean Motion.mp3"],
    ["Digital Dreams", "Future Bass", "10 - Digital Dreams.mp3"],
    ["Night Rider", "Synthwave", "11 - Night Rider.mp3"],
    ["Firestarter", "EDM", "12 - Firestarter.mp3"],
    ["Sunset Bounce", "Dance", "13 - Sunset Bounce.mp3"],
    ["Gravity", "Electronic", "14 - Gravity.mp3"],
    ["Pulse Theory", "Techno", "15 - Pulse Theory.mp3"],
    ["Dream Runner", "Chillwave", "16 - Dream Runner.mp3"],
    ["Hyperdrive", "Drum & Bass", "17 - Hyperdrive.mp3"],
    ["Golden Hour", "Lo-fi", "18 - Golden Hour.mp3"],
    ["Starlight", "Ambient", "19 - Starlight.mp3"],
    ["Bassline City", "House", "20 - Bassline City.mp3"],
    ["Retro Future", "Synthwave", "21 - Retro Future.mp3"],
    ["Energy Mode", "EDM", "22 - Energy Mode.mp3"],
    ["Moonlight", "Chill", "23 - Moonlight.mp3"],
    ["Zero Gravity", "Future Bass", "24 - Zero Gravity.mp3"],
    ["Laser Dreams", "Techno", "25 - Laser Dreams.mp3"],
    ["Parallel", "Electronic", "26 - Parallel.mp3"],
    ["Wild Signal", "Dance", "27 - Wild Signal.mp3"],
    ["Infinite Loop", "House", "28 - Infinite Loop.mp3"],
    ["Cosmic Ride", "Synth Pop", "29 - Cosmic Ride.mp3"],
    ["Final Destination", "Drum & Bass", "30 - Final Destination.mp3"]
];


const A = document.getElementById("audio");

$ = id => document.getElementById(id);

let cur = -1;
let repeat = false;
let shuffle = false;
let liked = new Set();


function time(x) {
    return isFinite(x)
        ? Math.floor(x / 60) + ":" + String(Math.floor(x % 60)).padStart(2, "0")
        : "0:00";
}


function draw(list, id) {
    $(id).innerHTML = "";

    list.forEach(t => {
        let i = tracks.indexOf(t);

        let r = document.createElement("div");

        r.className = "track";

        r.innerHTML = `
            <div class="trackart">♪</div>
            <div>
                <b>${t[0]}</b>
                <small>Sound Wave Original</small>
            </div>
            <div class="genre">${t[1]}</div>
            <span>MP3</span>
            <button>▶</button>
        `;

        r.ondblclick = () => play(i);

        r.querySelector("button").onclick = () => play(i);

        $(id).appendChild(r);
    });
}


function play(i) {
    cur = i;

    let t = tracks[i];

    A.src = "audio/" + encodeURIComponent(t[2]);

    A.play();

    $("title").textContent = t[0];

    $("genre").textContent = t[1];

    $("art").textContent = "♪";

    $("play").textContent = "Ⅱ";

    $("like").textContent = liked.has(i) ? "♥" : "♡";
}


function next() {
    play(
        shuffle
            ? Math.floor(Math.random() * tracks.length)
            : (cur + 1) % tracks.length
    );
}


function prev() {
    play(
        (cur - 1 + tracks.length) % tracks.length
    );
}


$("play").onclick = () => {

    if (cur < 0) {
        play(0);
    }

    else if (A.paused) {
        A.play();
        $("play").textContent = "Ⅱ";
    }

    else {
        A.pause();
        $("play").textContent = "▶";
    }

};


$("next").onclick = next;

$("prev").onclick = prev;

$("playAll").onclick = () => play(0);

$("shuffle").onclick = () => shuffle = !shuffle;


$("like").onclick = () => {

    if (cur >= 0) {

        liked.has(cur)
            ? liked.delete(cur)
            : liked.add(cur);

        $("like").textContent =
            liked.has(cur)
                ? "♥"
                : "♡";
    }

};


$("rep").onclick = () => {

    repeat = !repeat;

    $("rep").style.color =
        repeat
            ? "#35e99d"
            : "";
};


$("volume").oninput = e => {
    A.volume = e.target.value;
};


A.ontimeupdate = () => {

    $("cur").textContent =
        time(A.currentTime);

    $("dur").textContent =
        time(A.duration);

    $("seek").value =
        A.duration
            ? A.currentTime / A.duration * 100
            : 0;
};


$("seek").oninput = e => {

    if (A.duration) {
        A.currentTime =
            e.target.value / 100 * A.duration;
    }

};


A.onended = () =>
    repeat
        ? (A.currentTime = 0, A.play())
        : next();


function search(q) {

    q = q.toLowerCase();

    draw(
        tracks.filter(
            t =>
                t[0].toLowerCase().includes(q) ||
                t[1].toLowerCase().includes(q)
        ),
        "results"
    );
}


$("topSearch").oninput = e => {

    if (e.target.value) {
        show("search");
    }

    search(e.target.value);
};


$("bigSearch").oninput = e =>
    search(e.target.value);


function show(v) {

    document
        .querySelectorAll(".view")
        .forEach(
            x => x.classList.add("hidden")
        );

    $(v).classList.remove("hidden");

    document
        .querySelectorAll(".nav")
        .forEach(
            x =>
                x.classList.toggle(
                    "active",
                    x.dataset.v == v
                )
        );
}


document
    .querySelectorAll(".nav")
    .forEach(
        x =>
            x.onclick = () =>
                show(x.dataset.v)
    );


document
    .querySelectorAll(".pl")
    .forEach(
        x =>
            x.onclick = () => {

                show("library");

                let g = x.dataset.g;

                draw(
                    g == "Energy"
                        ? tracks.filter(
                            t =>
                                /EDM|Dance|Drum & Bass|Techno/.test(t[1])
                        )
                        : g == "Chill"
                            ? tracks.filter(
                                t =>
                                    /Chill|Ambient|Lo-fi/.test(t[1])
                            )
                            : tracks,
                    "libraryList"
                );
            }
    );


document.getElementById("count").textContent =
    "30 tracks";


tracks.slice(0, 6).forEach(
    (t, i) => {

        let c =
            document.createElement("div");

        c.className = "card";

        c.innerHTML = `
            <div class="cardart">♪</div>
            <b>${t[0]}</b>
            <small>${t[1]}</small>
        `;

        c.onclick = () => play(i);

        $("cards").appendChild(c);
    }
);


draw(tracks, "list");

draw(tracks, "libraryList");