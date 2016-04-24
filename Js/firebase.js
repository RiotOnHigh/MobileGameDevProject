/**
 * Created by Fritz8 on 10/04/2016.
 */
var fb = new Firebase("https://glaring-fire-4830.firebaseio.com/"),
    locations = {},
    result_box = document.getElementById("result");

if (fb) {
    // This gets a reference to the 'location" node.
    var fbLocation = fb.child("/location");
    // Now we can install event handlers for nodes added, changed and removed.
    fbLocation.on('child_added', function(sn){
        var data = sn.val();
        console.dir({'added': data});
        locations[sn.key()] = data;
    });
    fbLocation.on('child_changed', function(sn){
        var data = sn.val();
        locations[sn.key()] = data;
        console.dir({'moved': data})
    });
    fbLocation.on('child_removed', function(sn){
        var data = sn.val();
        delete locations[sn.key()];
        console.dir(({'removed': data}));
    });
};

function getKey(name){
    var loc;
    for(loc in locations){
        if(locations[loc].player === name){
            return loc;
        }
    }
    return null;
}

function addLocation(name, x, y) {
    // Prevent a duplicate name...
    if (getKey(name)) return;
    // Name is valid - go ahead and add it...
    fb.child("/location").push({
        player: name,
        x: x,
        y: y,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err) {
        if(err) console.dir(err);
        showLocations();
    });
}

function updateLocation(ref, name, x, y){
    fb.child("/location/" + ref).set({
        player: name,
        x: x,
        y: y,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err) {
        if(err) {
            console.dir(err);
        }
        showLocations();
    });
}

function removeLocation(ref){
    fb.child("/location/" + ref).set(null, function(err){
        if (err) console.dir(err);
        showLocations();
    });
}

document.getElementById("post").addEventListener("click", function() {
    var x, y, name;
    name = $("#name").val();
    x = $("#x").val();
    y = $("#y").val();
    addLocation(name, x, y);
});

function formatPlayerInfo(location) {
    "use strict";
    var info = location + ":", loc = locations[location];
    info += loc.player + " @ (" + loc.x + ", " + loc.y + ") - " + loc.timestamp + "\n";
    return info;
}

function showLocations() {
    "use strict";
    var loc, info = "";
    for (loc in locations) {
        info += formatPlayerInfo(loc);
    }
    result_box.innerText = info;
}