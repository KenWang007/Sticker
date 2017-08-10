'use strict';

const groupSummaryTemplate = ` 
       <div class="sticker-div <%= classcolor %>">
        <div class="closeicon">x</div>
         <label>Header</label>
         <input type="text" class="sticker-header"  data-stickerid='<%= stickerIndex %>' value='<%= header %>'/>
        <div class="sticker-body" contenteditable="true" data-stickerid='<%= stickerIndex %>'><%= content %></div>
    </div>`;

$(document).ready(function () {

    resetStickerState();

    let index = window.localStorage.valueOf().length;

  $(".add-sticker-js").on("click", () => {
    index = index + 1;
    var compiled = _.template(groupSummaryTemplate);
    var stickerType = $("#sticker-types option:selected").attr("class");
    var stickerInfo = compiled({ "stickerIndex": index,"header":"","content":"","classcolor":stickerType });
    $(".sticker-container-js").append(stickerInfo);

    window.localStorage.setItem(index, JSON.stringify({"stickerIndex":index, "header":"","content":"","classcolor":stickerType }));
        
    $(".sticker-body").on("blur",autoSaveStickerAfterBlur);
    $(".sticker-header").on("blur",autoSaveStickerAfterBlur);
    $(".closeicon").bind("click",deleteSticker);
});

$(".clear-sticker-js").on("click",()=>{
    $(".sticker-div").remove();
window.localStorage.clear();
}); 

$(window).keyup(function(e){
    if(e.keyCode==27){
        $(".closeicon").css("visibility", "hidden"); 
    }    
});

$(".closeicon").on("click", ()=> {
    deleteSticker();
});

$(".filter-color-js").click(function(e) {
    filterSticker(e);
});

$("#sticker-types").on("change",function(e)
{
    var stickerType = $("#sticker-types option:selected").attr("class");
    $("#sticker-types").removeClass(); 
    $("#sticker-types").addClass(stickerType);
});

$(".filter-color-js").on("click",saveStickerSkin);
$(".sticker-body").on("blur",autoSaveStickerAfterBlur);
$(".sticker-header").on("blur",autoSaveStickerAfterBlur);
$(".closeicon").bind("click",deleteSticker);
});


function filterSticker(e) {
    var filterColor = $(e.target).data("color");
    if (filterColor === "sticker-types-class-all") {
        $("div.sticker-div").show();
    } else {
        $("div.sticker-div:not(."+ filterColor +")").hide();
        $("div.sticker-div."+ filterColor).show();
    }
}

function deleteSticker() {
    var currentStickerId = $(this).siblings(".sticker-body").data("stickerid");
    window.localStorage.removeItem(currentStickerId); 
    $(this).parent().remove();
}

function resetStickerState() {
    if (window.localStorage.length > 0 ) {
        for (var i = 0; i < window.localStorage.valueOf().length; i++) {
            let stickerInfo = window.localStorage.valueOf()[window.localStorage.key(i)];
            if (stickerInfo !== null) {
                var compiled = _.template(groupSummaryTemplate);
                var templateData = JSON.parse(stickerInfo);
                var element = compiled(templateData);
                $(".sticker-container-js").append(element);
            }
        }
    }
}

function webSocket() {
    var websocket = new WebSocket("ws://localhost:54513");
    websocket.onopen = function() {
        websocket.send("test");
    }

}

function saveStickerSkin() {
    for (var i = 0; i < window.localStorage.valueOf().length; i++) {
        let stickerInfo = window.localStorage.valueOf()[window.localStorage.key(i)];
        if (stickerInfo !== null) {
            var stickerInfoObj = JSON.parse(stickerInfo);
            stickerInfoObj.color = $(this).css("background-color");
            window.localStorage.setItem(window.localStorage.key(i),JSON.stringify(stickerInfoObj));
        }
    }
}

function autoSaveStickerAfterBlur() {
    var currentStickerId = $(this).attr("data-stickerid");
    var currentStickerInfo = JSON.parse(window.localStorage.getItem(currentStickerId));
    if ($(this).attr("class") === "sticker-header") {
        currentStickerInfo.header = $(this).val();
    }
    if ($(this).attr("class") === "sticker-body") {
        currentStickerInfo.content = $(this).text();
    }
    window.localStorage.setItem(currentStickerId,JSON.stringify(currentStickerInfo));
}