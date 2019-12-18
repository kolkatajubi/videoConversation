var fullscreen = 0;

var buttonData = "Send";
$(document).ready(() => {
  $(".text-send-idle").click(event => {
    let el = event.currentTarget;
    el.lastElementChild.style.display = "block";
    el.firstElementChild.style.display = "none";
    el.style.float = "right";
    el.style["margin-right"] = "1%";
    el.classList.add("text-send-transition");
    el.addEventListener("animationend", () => {
      el.classList.remove("text-send-transition");
      el.classList.remove("text-send-idle");
      el.classList.add("text-send");
      el.style.width = "34px";
    });
  });

  $("body").on("click", ".text-send", event => {
    console.log(event);
    let btn = event.currentTarget;
    btn.parentElement.classList.toggle("active");
    btn.parentElement.style.padding = "0px";
    btn.parentElement.addEventListener("animationend", () => {
      btn.parentElement.classList.remove("active");
      btn.parentElement.classList.add("remove");
    });
  });

  console.log("ready");
  let classes = document.getElementsByClassName("button");
  for (let element of classes) {
    console.log(element);
    element.style.width = buttonData.length * 12 + "px";
  }
});

// function run(button) {}

function playPause() {
  // FS();
  // console.log("play called fullscreen...");
  if (myVideo.paused) {
    removeBlurBackground();
    myVideo.play();
    // document.getElementById("playpause").innerHTML = "PAUSE";
  } else {
    myVideo.pause();
    blurBackground();
    // document.getElementById("playpause").innerHTML = "PLAY";
  }
}

function removeBlurBackground() {
  document.getElementById("myVideo").style.filter = "blur(0px)";
}

function blurBackground() {
  document.getElementById("myVideo").style.filter = "blur(10px)";
}

function exitHandler(document) {
  console.log("exit handler...");
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    fullscreen = 0;
    console.log("fullscreen = ", fullscreen);
    // document.getElementById("fs").innerHTML = "FULLSCREEN";
    // $(".display")
    //   .width(640)
    //   .height(360);
  }
}

function FS() {
  console.log("fullscreen called...FS");
  if (fullscreen == 0) {
    if (document.body.requestFullscreen) document.body.requestFullscreen();
    else if (document.body.mozRequestFullScreen)
      document.body.mozrequestFullscreen();
    else if (document.body.webkitRequestFullscreen)
      document.body.webkitRequestFullscreen();
    else if (document.body.msRequestFullscreen)
      document.body.msRequestFullscreen();

    console.log("fullscreen = ", fullscreen);
    // document.getElementById("fs").innerHTML = "EXIT FULLSCREEN";
    $(".display")
      .width("100%")
      .height("100%");
  }
}

// function toggleFS() {
//   // console.log("toggle fullscreen called...", fullscreen);
//   if (fullscreen == 0) FS();
// }
function moveTouch(ev) {
  FS();
  // Process the event
}

function init() {
  var el = document.getElementById("target1");
  el.ontouchmove = moveTouch;
}
