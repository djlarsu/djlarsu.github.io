var Generator = {};

Generator.fonts = [
    "Indie Flower", "Comic Sans MS", "Shadows Into Light", "Pacifico", "Dancing Script",
    "Shadows Into Light Two", "Coming Soon", "Handlee", "Cookie",
    "Tangerine", "Great Vibes", "Damion", "Patrick Hand", "Bad Script",
    "Calligraffitti", "Waiting for the Sunrise", "Reenie Beanie",
    "Nothing You Could Do", "Sacramento", "Crafty Girls", "Allura",
    "Kalam", "Yellowtail", "Italianno", "Give You Glory",
    "Dawning of a New Day", "League Script", "Ruthie",
    "Lovers Quarrel", "Mrs Saint Delafield", "Mrs Sheppards",
    "Meie Script", "Princess Sofia", "Caveat", "Iceland"
];

Generator.createCreditLink = function(url, name, steamid){
    if(url === "reddit") url = "https://www.reddit.com/user/" + name;
    if(url === "steam") url = "http://steamcommunity.com/" + ( typeof steamid === "undefined" ? "id/" + name : "profiles/" + steamid);
    return "<a href='" + url + "' target='_blank'>" + name + "</a>"
};

Generator.credits = {
    "boston18 (illustrated)": Generator.createCreditLink("steam", "TrollzDyztroyed", "76561198278589065"),
    "comedy15"              : Generator.createCreditLink("steam", "CrueLy", "76561198082596568"),
};

Generator.eventNames = {
    "csc"              : "Counter Strike Confederation"
};

Generator.backgrounds = [
    "space-beige", "space-blue-1", "space-blue-2", "space-green", "space-red", "space-orange", "space-yellow",
    "cache-1", "cache-2", "cache-3", "cache-4", "cache-5", "cache-6",
    "mirage-1", "mirage-2", "mirage-3", "mirage-4", "mirage-5",
    "overpass-1", "overpass-2", "overpass-3", "overpass-4", "overpass-5", "overpass-6"
];

Generator.events = {
    "csc" : [
        "ACA", "AP", "ATL", "ATO", "AVI", "BS", "FRG", "GAS", "COW", "H4K", "HEL", "HG", "NAN", "OS", "SAV", "UPS", "WET", "YC"
    ]
};

Generator.option                = {};

Generator.option.shadow         = {};
Generator.option.shadow.color   = '#000';
Generator.option.shadow.blur    = 1;
Generator.option.shadow.offsetX = 0;
Generator.option.shadow.offsetY = 2.5;

Generator.obFirst = function(o){
    return Object.keys(o)[0];
};

Generator.currentEvent      = Generator.obFirst(Generator.events);
Generator.lastEvent         = null;
Generator.downloadName      = "csgo_signature.png";
Generator.labelColor        = "#FFFFFF";
Generator.labelText         = '';
Generator.backgroundSource  = 'bg.png';
Generator.textStyle         = 'false';

Generator.defaultBG         = Generator.backgroundSource;

Generator.canvasWidth       = 250;
Generator.canvasHeight      = 250;

Generator.stickerImage      = new Image();
Generator.bgImage           = new Image();

Generator.bgImage.crossOrigin       = "use-credentials";
Generator.stickerImage.crossOrigin  = "use-credentials";

Generator.$                 = {};

Generator.updateElements = function(){
    Generator.$downloadButton        = $(".download-btn");
    Generator.$fontSelect            = $("#font");
    Generator.$eventSelect           = $("#event");
    Generator.$teamSelect            = $("#team");
    Generator.$textStyle             = $("#textStyle");
    Generator.$cusBackground         = $("#custom-background");
    Generator.$remBackground         = $(".rem-button");
    Generator.$bgButton              = $(".add-background");
    Generator.$labelInput            = $("#label");
    Generator.$backgroundPreset      = $("#backgroundPreset");
    Generator.$credit                = $(".credit");

    Generator.$labelPosUpDown        = $("#labelPosUpDown");
    Generator.$labelPosLeftRight     = $("#labelPosLeftRight");
    Generator.$labelSize             = $("#labelSize");
    Generator.$labelRotation         = $("#labelRotation");
    Generator.$stickerPosUpDown      = $("#stickerPosUpDown");
    Generator.$stickerPosLeftRight   = $("#stickerPosLeftRight");
    Generator.$stickerSize           = $("#stickerSize");
    Generator.$stickerRotation       = $("#stickerRotation");

    Generator.$stickerCanvas         = $("#sticker-canvas").get(0);

    Generator.$stickerCanvas.width   = Generator.canvasWidth;
    Generator.$stickerCanvas.height  = Generator.canvasHeight;

    Generator.context                = Generator.$stickerCanvas.getContext('2d');

    window.colorChange = function(p){
        Generator.labelColor = p.toHEXString();
        Generator.render();
    };
};

Generator.capIt = function(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Generator.populateBackgrounds = function(){
    Generator.$backgroundPreset.html('');
    $("<option>", { html : "Recommended Backgrounds", value : "false" }).appendTo(Generator.$backgroundPreset);
    for(var i = 0; i < Generator.backgrounds.length; i++){
        $("<option>", {
            html : Generator.capIt(Generator.backgrounds[i].replace(/-/gi, ' ')),
            value : Generator.backgrounds[i]
        }).appendTo(Generator.$backgroundPreset);
    }
    Generator.render();
};

Generator.populateTeams = function(){
    Generator.currentEvent = Generator.$eventSelect.val();
    if(Generator.lastEvent !== Generator.currentEvent){
        Generator.lastEvent = Generator.currentEvent;
        Generator.$teamSelect.html('');
        for(var i = 0; i < Generator.events[Generator.currentEvent].length; i++){
            $("<option>", {
                value : Generator.events[Generator.currentEvent][i],
                html : Generator.events[Generator.currentEvent][i]
            }).appendTo(Generator.$teamSelect);
        }
        Generator.changeTeam();
    }
};

Generator.populateFonts = function(){
    Generator.$fontSelect.html('');
    for(var i = 0; i < Generator.fonts.length; i++){
        $("<option>", {
            html : Generator.fonts[i],
            style : 'font-family: "' + Generator.fonts[i] + '"'
        }).appendTo(Generator.$fontSelect);
    }
};

Generator.changeTeam = function(){
    Generator.stickerImage.src = [
        "assets/", Generator.currentEvent, "/", Generator.$teamSelect.val().toLowerCase().replace(/ /gi, '-'), ".png"
    ].join('');
    Generator.$credit.html( (typeof Generator.credits[Generator.currentEvent] !== "undefined" ? "Credits to " + Generator.credits[Generator.currentEvent] + " for this set": "") );
    Generator.render();
};

Generator.render = function(){
    Generator.populateTeams();

    if(Generator.bgImage.complete && Generator.bgImage.width > 0 && Generator.bgImage.height > 0){
        Generator.context.drawImage(Generator.bgImage, 0, 0, Generator.canvasWidth, Generator.canvasHeight);
    } else return;

    if(Generator.stickerImage.complete && Generator.stickerImage.width > 0 && Generator.stickerImage.height > 0){
        Generator.context.save();
        Generator.context.scale(Generator.$stickerSize.val(), Generator.$stickerSize.val());
        Generator.context.translate(Generator.canvasWidth * (1 - Generator.$stickerPosLeftRight.val()), Generator.canvasHeight * (1 - Generator.$stickerPosUpDown.val()));
        Generator.context.translate(Generator.canvasWidth/2, Generator.canvasHeight/2);
        Generator.context.rotate(Math.PI / 180 * Generator.$stickerRotation.val());
        Generator.context.translate(-(Generator.canvasWidth/2), -(Generator.canvasHeight/2));
        Generator.context.drawImage(Generator.stickerImage, 0, 0, Generator.canvasWidth, Generator.canvasHeight);
        Generator.context.restore();
    } else return;

    Generator.labelText = Generator.$labelInput.val();
    Generator.context.save();

    Generator.textStyle = Generator.$textStyle.val();

    if(Generator.textStyle === 'shadow'){
        Generator.context.shadowColor = Generator.option.shadow.color;
        Generator.context.shadowOffsetX = Generator.option.shadow.offsetX;
        Generator.context.shadowOffsetY = Generator.option.shadow.offsetY;
        Generator.context.shadowBlur = Generator.option.shadow.blur;
    }

    Generator.context.fillStyle = Generator.labelColor;
    Generator.context.font = Generator.$labelSize.val() + 'px "' + Generator.$fontSelect.val() + '"';

    Generator.context.translate(Generator.canvasWidth * (1 - Generator.$labelPosLeftRight.val()), Generator.canvasHeight * (1 - Generator.$labelPosUpDown.val()));
    Generator.context.rotate(Generator.$labelRotation.val() * Math.PI / 180);
    Generator.context.fillText(Generator.labelText, -((Generator.context.measureText(Generator.labelText)).width)/2, 14);

    if(Generator.textStyle === 'stroke1'){
        Generator.context.lineWidth = 1;
        Generator.context.strokeText(Generator.labelText, -((Generator.context.measureText(Generator.labelText)).width)/2, 14);
    }
    if(Generator.textStyle === 'stroke2'){
        Generator.context.lineWidth = 2;
        Generator.context.strokeText(Generator.labelText, -((Generator.context.measureText(Generator.labelText)).width)/2, 14);
    }

    Generator.context.restore();

    // window.location.href = "#?name=" + Generator.labelText + "&event=" + Generator.currentEvent + "&team=" + Generator.$teamSelect.val();
};

Generator.download = function(){
    Generator.$downloadButton[0].href = Generator.$stickerCanvas.toDataURL();
    Generator.$downloadButton[0].download = Generator.downloadName;
};

Generator.removeBackground = function(){
    Generator.$backgroundPreset.val('false');
    Generator.backgroundSource = Generator.defaultBG;
    Generator.bgImage.src = Generator.backgroundSource;
    Generator.$bgButton.show();
    Generator.$remBackground.hide();
};

Generator.showCustomDialogue = function(){
    Generator.$cusBackground.val('');
    Generator.$cusBackground.click();
};

Generator.backgroundChange = function(e){
    var file;
    if((file = this.files[0])){
        var image = new Image();
        image.onload = function(){
            Generator.backgroundSource = (window['URL'] || window['webkitURL']).createObjectURL(file);
            Generator.$remBackground.show();
            Generator.$bgButton.hide();
            Generator.bgImage.src = Generator.backgroundSource;
        };
        image.src = (window['URL'] || window['webkitURL']).createObjectURL(file);
    }
};

Generator.populateEvents = function(){
    Generator.$eventSelect.html('');
    for(var i = 0; i < Object.keys(Generator.events).length; i++){
        var event = Object.keys(Generator.events)[i];
        $("<option>", {
            html : Generator.eventNames[event],
            value : event
        }).appendTo(Generator.$eventSelect);
    }
};

Generator.applyCustomBackground = function(){
    if(Generator.$backgroundPreset.val() === "false") return Generator.removeBackground();
    Generator.bgImage.src = 'assets/backgrounds/' + Generator.$backgroundPreset.val() + '.png';
    Generator.$cusBackground.val('');
    Generator.$remBackground.show();
    Generator.$bgButton.hide();
    Generator.render();
};

Generator.setEvents = function(){

    Generator.$downloadButton.on('click tap', Generator.download);
    Generator.$labelInput.on('input', Generator.render);
    Generator.$labelPosUpDown.on('input change', Generator.render);
    Generator.$labelPosLeftRight.on('input change', Generator.render);
    Generator.$labelSize.on('input change', Generator.render);
    Generator.$labelRotation.on('input change', Generator.render);
    Generator.$stickerPosUpDown.on('input change', Generator.render);
    Generator.$stickerPosLeftRight.on('input change', Generator.render);
    Generator.$stickerSize.on('input change', Generator.render);
    Generator.$stickerRotation.on('input change', Generator.render);
    Generator.$fontSelect.on('input change', Generator.render);
    Generator.$eventSelect.on('input change', Generator.changeTeam);
    Generator.$teamSelect.on('input change', Generator.changeTeam);
    Generator.$remBackground.on('click', Generator.removeBackground);
    Generator.$cusBackground.on('change', Generator.backgroundChange);
    Generator.$bgButton.on('click', Generator.showCustomDialogue);
    Generator.$textStyle.on('input change', Generator.render);
    Generator.$backgroundPreset.on('input change', Generator.applyCustomBackground);

    Generator.stickerImage.addEventListener('load', Generator.render);
    Generator.bgImage.addEventListener('load', Generator.render);
};

Generator.getUrlParam = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

Generator.applyParams = function(){
    // Secret Stuff.
    // ?name=Kain&image=https://i.imgur.com/HWt2KOe.jpg
    Generator.$labelInput.val(Generator.getUrlParam('name') || "Rambo");
    if(Generator.getUrlParam('image')){
        Generator.bgImage.src = Generator.getUrlParam('image');
    }
};

Generator.init = function(){
    WebFont.load({
        active : Generator.render,
        google : { families : Generator.fonts }
    });
    Generator.updateElements();
    Generator.setEvents();
    Generator.$remBackground.hide();
    Generator.populateEvents();
    Generator.populateFonts();
    Generator.populateBackgrounds();
    Generator.bgImage.src = Generator.backgroundSource;
    Generator.applyParams();
};

$(document).ready(Generator.init);
