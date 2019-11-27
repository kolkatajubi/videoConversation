// ?rel=0?version=3&modestbranding=1&autohide=1&autoplay=1&controls=0&loop=0&disablekb=1&iv_load_policy=3&rel=0&feature=oembed&showinfo=0

var flow = {
  _id: {
    $oid: "5db16a857a18e0fd769d0c06"
  },
  flowId: "getstarted",
  projectId: "VideoPOC_191901911101",
  id: "VideoPOC_191901911101-getstarted",
  stages: [
    {
      text: ["intro"],
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/intro.mp4",
      // video:
      //   '<iframe width="560" height="315" src="https://www.youtube.com/embed/saFRT7t6vis" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/Ah0Ys50CqO8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video:
      //   '<iframe width="560" height="315" src="https://www.youtube.com/embed/Ah0Ys50CqO8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://www.youtube.com/embed/saFRT7t6vis",
      // video: "https://www.youtube.com/watch?v=saFRT7t6vis&feature=youtu.be",
      stage: "intro",
      type: "button",
      next: {
        data: [
          {
            data: "Count_me_in",
            text: "Count me in!"
            //count: 1
          }
        ],
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: {
            countmein: ""
          },
          type: "wordList"
        }
      }
    },
    {
      text: ["name"],
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/name.mp4",
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/bdPZ2Cu1vNU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video:
      //   '<iframe width="560" height="315" src="https://www.youtube.com/embed/DTHdcDW8lsc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://www.youtube.com/embed/DTHdcDW8lsc",
      type: "text",
      stage: "name",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: "[a-zA-Z\\s]+",
          type: "regex"
        }
      }
    },
    {
      text: ["gender"],
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/Ah0Ys50CqO8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/gender.mp4",
      // video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/PmEhyAWcSz0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://www.youtube.com/embed/PmEhyAWcSz0",
      type: "button",
      stage: "gender",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: {
            mr: "",
            mrs: ""
          },
          type: "wordList"
        },
        data: [
          {
            data: "Mr",
            text: "Mr"
            //count: 3
          },
          {
            data: "Miss",
            text: "Miss/Mrs"
            //count: 2
          }
        ]
      }
    },
    {
      text: ["age"],
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/age.mp4",
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/6dJmILRJU7E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://www.youtube.com/embed/6dJmILRJU7E",
      type: "text",
      stage: "age",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: "\\d+",
          type: "regex"
        }
      }
    },
    {
      text: ["city"],
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/city.mp4",
      // video: '<iframe width="560" height="315" src="https://www.youtube.com/embed/nke3160rCas" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/nke3160rCas" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      type: "button",
      stage: "city",
      next: {
        data: [
          {
            data: "Mumbai",
            text: "Mumbai"
            //count: 1
          },
          {
            data: "Kolkata",
            text: "Kolkata"
            //count: 2
          },
          {
            data: "Delhi",
            text: "Delhi"
            //count: 3
          },
          {
            data: "Chennai",
            text: "Chennai"
            //count: 4
          }
        ],
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: {
            mumbai: "",
            kolkata: "",
            chennai: "",
            delhi: ""
          },
          type: "wordList"
        }
      }
    },
    {
      text: ["mobile"],
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/mobile.mp4",
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/QISY70zukng" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://www.youtube.com/embed/QISY70zukng",
      type: "text",
      stage: "mobile",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: "\\d{10}",
          type: "regex"
        }
      }
    },
    {
      text: ["end"],
      // video: "https://pixie.jubi.ai/videoConversation/static/videos/end.mp4",
      video:
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/odcGI88uPts" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
      // video: "https://www.youtube.com/embed/odcGI88uPts",
      type: "button",
      stage: "end",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    }
  ]
};
var totalclicks = {
  Count_me_in: 1,
  Mr: 3,
  Miss: 4,
  Mumbai: 1,
  Kolkata: 2,
  Delhi: 3,
  Chennai: 4
};

var theme = {
  default: "",
  dark: "https://pixie.jubi.ai/videoConversation/static/css/styledark.css",
  light: "https://pixie.jubi.ai/videoConversation/static/css/stylexls.css"
};
var currentStageNum = -1; // Stores current stage number
var flowJSON = {}; // Stores flow key(stage name) - value(stage data) pair
var currentData = {}; // Stores current stage data
var display = ""; // HTML DOM elements to be displayed
var status = 0; // Tracks if button is displayed or not
var fullscreen = 0; // Tracks if the view is fullscreen or not
var firstClick = 0; // First video click of the user

//======================================================================================
restructureData();
// console.log(flowJSON);

$(document).ready(() => {
  // let testExp = new RegExp("Android|" + "BlackBerry|" + "IEMobile|Mobile", "i");
  // if (testExp.test(navigator.userAgent)) {

  documentReady();
  getNextStageData();
  /*$.ajax({
    type: "get",
    url: "https://pixie.jubi.ai/videoConversation/getdata",
    contentType: "Application/json"
  })
    .done(function(result) {
      for (let i = 0; i < result.length; i++) {
        /*var output = `{` + i + `:` + result[i]`}`;
        console.log(output);
        totalclicks[i] = result[i];
        console.log("result:::::" + totalclicks);

        event.preventDefault();
      }
    })
    .fail(function(e) {
      console.log(e);
    });*/
  setInterval(() => {
    if (/www.youtube.com/.test(currentData.video)) {
      console.log("YOUTUBE video encountered...");
      if (status == 0) {
        status = 1;
        // console.log("1secs left...");
        createUI(currentData);
      }
    } else {
      // console.log("setInterval...");
      console.log("NORMAL video encountered...");
      var videoDuration = document
        .getElementById("myVideo")
        .duration.toFixed(2);
      var videoTime = document.getElementById("myVideo").currentTime.toFixed(2);
      // var videoDuration = document
      //   .getElementsByClassName("video-stream html5-main-video")[0]
      //   .duration.toFixed(2);
      // var videoTime = document
      //   .getElementsByClassName("video-stream html5-main-video")[0]
      //   .currentTime.toFixed(2);
      // console.log(videoTime);
      if (status == 0)
        if (videoTime >= videoDuration * 0.15) {
          status = 1;
          // console.log("1secs left...");
          createUI(currentData);
        }
      if (videoTime == videoDuration) blurBackground();
    }
  }, 100);
  // } else {
  //   console.log("Desktop user");
  //   document.getElementsByClassName(
  //     "display"
  //   )[0].innerHTML = `<h3>This page only works for <b>Android</b> mobile users</h3>`;
  //   document.getElementsByClassName("display")[0].style.color = "white";
  // }

  // document.getElementById("stylesheet").href = theme[flow.theme];
  // document.addEventListener("fullscreenchange", exitHandler);
  // document.addEventListener("webkitfullscreenchange", exitHandler);
  // document.addEventListener("mozfullscreenchange", exitHandler);
  // document.addEventListener("MSFullscreenChange", exitHandler);

  // exitHandler(document);

  // $(".text-send-idle").click(event => {
  //   let el = event.currentTarget;
  //   el.lastElementChild.style.display = "block";
  //   el.firstElementChild.style.display = "none";
  //   el.style.float = "right";
  //   el.style["margin-right"] = "1%";
  //   el.classList.add("text-send-transition");
  //   el.addEventListener("animationend", () => {
  //     console.log("animation END......");
  //     getNextStageData();
  // el.classList.remove("text-send-transitiFon");
  // el.classList.remove("text-send-idle");
  // el.classList.add("text-send");
  // el.style.width = "34px";
  // setTimeout(() => {
  //   console.log("revert Called......");
  //   el.style["margin-right"] = undefined;
  //   el.style.float = undefined;
  //   el.lastElementChild.style.display = "none";
  //   el.firstElementChild.style.display = "block";
  //   el.classList.remove("text-send");
  //   el.classList.add("text-send-idle");
  //   el.style.width = "22%";
  // }, 2000);
  //   });
  // });

  // console.log("ready");
  let classes = document.getElementsByClassName("button");
  for (let element of classes) {
    // console.log(element);
    element.style.width = buttonData.length * 12 + "px";
  }

  $("body").on("click", ".button", event => {
    console.log("event trigged..........");
    console.log("here" + this.id);
    let button = event.currentTarget;
    // console.log("event.currenttarget")
    // console.log(event.currentTarget);
    console.log();
    event.preventDefault();

    let type = button.firstElementChild.getAttribute("type");
    //let count = button.firstElementChild.getAttribute("count");
    let value = button.firstElementChild.getAttribute("value");
    //console.log(count);
    console.log(value);
    totalclicks[value] = totalclicks[value] + 1;
    console.log("data in saving process....");

    $.ajax({
      type: "POST",
      url: "https://pixie.jubi.ai/videoConversation/savedata",
      data: JSON.stringify(totalclicks),
      contentType: "Application/json",
      success: function(data) {
        console.log("data::::" + data);
      }
    });

    localStorage.setItem("tempclick", JSON.stringify(totalclicks));
    console.log("getclick");
    console.log(localStorage.getItem("tempclick"));

    if (type != "url") {
      // console.log("after button clicked count will be");

      // for (i in currentData.next.data) {
      //   increment = 1;
      //   if (currentData.next.data[i].data === "Count me in!") {
      //     increment = increment + currentData.next.data[i].count;
      //   } else if (currentData.next.data[i].data === "Mr") {
      //     increment = increment + currentData.next.data[i].count;
      //   } else if (currentData.next.data[i].data === "Miss/Mr") {
      //     increment = increment + currentData.next.data[i].count;
      //   }
      // }
      // console.log(increment);

      // console.log("data ==> ", data);
      console.log("After event");
      console.log(event);
      sum = 0;
      for (i in currentData.next.data) {
        for (j in totalclicks) {
          if (currentData.next.data[i].data == j) {
            sum = sum + totalclicks[j];
          }
        }
      }
      console.log("sum=" + sum);
      number_of_button_created_perStage_count = 0;
      for (i in currentData.next.data) {
        if (!currentData.next.data[i].type) {
          number_of_button_created_perStage_count++;
        }
      }
      console.log("count=" + number_of_button_created_perStage_count);
      if (number_of_button_created_perStage_count > 1 && sum > 0) {
        console.log("button display");
        console.log("here" + totalclicks[value]);

        $("#" + value).html(
          "<span style='color: green;'>" +
            Math.floor((totalclicks[value] / sum) * 100) +
            "%</span><br>"
        );
      } else {
        display =
          display +
          currentData.next.data[i].text +
          " "; /*+
              (totalclicks[j] / sum) * 100 +
              "%"
            //currentData.next.data[i].count*/
      }

      /* for (i in currentData.next.data) {
        //if (!currentData.next.data[i].type) {
        for (j in totalclicks) {
          if (currentData.next.data[i].data == j) {
           /* if (number_of_button_created_perStage_count > 1 && sum > 0) {
              console.log("button display");
              console.log("here" + totalclicks[j]);

              $("#" + value).append(
                "<span style='color: green;'>" +
                  Math.floor((totalclicks[j] / sum) * 100) +
                  "%</span><br>"
              );
            } else {
              display =
                display +
                currentData.next.data[i].text +
                " "; /*+
                    (totalclicks[j] / sum) * 100 +
                    "%"
                  //currentData.next.data[i].count
            }
            //console.log(display);
          }
       // }
        }
      }*/
      //alert("display");
      // display = display + `</div>`;
      //button.classList.toggle("active");
      //button.addEventListener("animationend", event => {
      //if (event.animationName == "Button") {
      // console.log(event);
      //button.classList.remove("active");
      //button.classList.add("remove");
      setTimeout(() => {
        button.classList.toggle("active");
        button.addEventListener("animationend", event => {
          if (event.animationName == "Button") {
            console.log(event);
            button.classList.remove("active");
            button.classList.add("remove");
            getNextStageData();
            console.log("nextStageCalled.....");
          }
        });
      }, 3000);
      //getNextStageData();
      // console.log("nextStageCalled.....");
      //}
      //});
      getSiblings(button).forEach(el => {
        el.style.opacity = "0.2";
        el.classList.toggle("inactive");
        el.addEventListener("animationend", () => {
          el.classList.remove("inactive");
          el.classList.add("remove");
        });
      });
    } else {
      window.open(button.firstElementChild.getAttribute("value"));
    }
  });
});

var getSiblings = function(elem) {
  // Setup siblings array and get the first sibling
  var siblings = [];
  var sibling = elem.parentNode.firstChild;

  // Loop through each sibling and push to the array
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
};

function exitHandler(document) {
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    fullscreen = 0;
    // document.getElementById("fs").innerHTML = "FULLSCREEN";
    // $(".display")
    //   .width(640)
    //   .height(360);
  }
}

function documentReady() {
  // localStorage.setItem("tempclick", " JSON.stringify(totalclicks)");

  $.ajax({
    type: "get",
    url: "https://pixie.jubi.ai/videoConversation/getdata",
    contentType: "Application/json"
  })
    .done(function(result) {
      console.log("result receive.........");
      for (let i in result) {
        totalclicks[i] = result[i];
        console.log(i + ":" + totalclicks[i]);

        event.preventDefault();
      }
      console.log("result end.........");
    })
    .fail(function(e) {
      console.log(e);
    });
  $(".display").append(`
      <video autoplay muted id="myVideo"  onclick="videoClick();" playsinline>
      </video>
      <div class="box">
      </div>
    `);
}

function videoClick() {
  if (firstClick == 0) {
    FS();
    myVideo.muted = false;
    firstClick = 1;
  } else {
    FS();
    playPause();
  }
}

function restructureData() {
  for (i = 0; i < flow.stages.length; i++) {
    //   var key = flow.stages[i].stage;
    //   var value = flow.stages[i];
    //   data[key] = value;
    flowJSON[flow.stages[i].stage] = flow.stages[i];
  }
}

function removeBlurBackground() {
  document.getElementById("myVideo").style.filter = "blur(0px)";
}

function blurBackground() {
  document.getElementById("myVideo").style.filter = "blur(1px)";
}

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

function FS() {
  // console.log("fullscreen called...FS");
  if (fullscreen == 0) {
    if (document.body.requestFullscreen) document.body.requestFullscreen();
    else if (document.body.mozRequestFullScreen)
      document.body.mozrequestFullscreen();
    else if (document.body.webkitRequestFullscreen)
      document.body.webkitRequestFullscreen();
    else if (document.body.msRequestFullscreen)
      document.body.msRequestFullscreen();

    // console.log("fullscreen = ", fullscreen);
    // document.getElementById("fs").innerHTML = "EXIT FULLSCREEN";
    $(".display")
      .width("100%")
      .height("100%");
  }
}

function getNextStageData(nextStage) {
  console.log("Next Stage ... ", nextStage);
  clearChat();
  if (!/www.youtube.com/.test(currentData.video)) removeBlurBackground();
  // $("#playImg").hide();
  status = 0;
  currentData = {}; // Stores current stage data
  display = ""; // HTML DOM elements to be displayed
  if (nextStage == undefined) {
    currentStageNum += 1;
    console.log("currentStageNum : ", currentStageNum);
    currentData = flow.stages[currentStageNum];
    // console.log(JSON.stringify(currentData, 0, 3));
    // if (base64loaded == "not yet") {
    // console.log("Video Data from URL...");
    videoDisplay(currentData.video);
    // } else {
    //   console.log("Video Data from base64...");
    //   videoDisplay("data:video/mp4;base64," + videoData[currentData.stage]);
    // }
    // createUI(currentData);
  } else {
    currentStageNum = Object.keys(flowJSON).indexOf(nextStage);
    console.log("currentStageNum : ", currentStageNum);
    currentData = flowJSON[nextStage];
    // console.log(JSON.stringify(currentData, 0, 3));
    // if (base64loaded == "not yet") {
    // console.log("Video Data from URL...");
    videoDisplay(currentData.video);
    // } else {
    //   console.log("Video Data from base64...");
    //   videoDisplay("data:video/mp4;base64," + videoData[currentData.stage]);
    // }
    // createUI(currentData);
  }
}

function videoDisplay(videoData) {
  console.log("videoDisplay...");
  console.log(videoData);
  console.log(jQuery.type(videoData));
  if (/www.youtube.com/.test(videoData)) {
    $("#myVideo").hide();
    // $(".display").remove("iframe");
    let tag = videoData.split(" ");
    let videoURL = tag[0] + " " + tag[1] + " " + tag[2] + " "; //` height="100%" width="100%" `;
    videoURL =
      videoURL +
      tag[3].substring(0, tag[3].length - 1) +
      `?rel=0&modestbranding=1&autohide=1&autoplay=1&disablekb=0&controls=1&loop=0&iv_load_policy=3&rel=0&feature=oembed&showinfo=0" `; //&disablekb=1
    videoURL =
      videoURL +
      tag[4] +
      " " +
      tag[5] +
      " " +
      tag[6] +
      " " +
      tag[7] +
      " " +
      tag[8] +
      " " +
      tag[9] +
      " " +
      tag[10];
    console.log(tag);
    console.log(tag.length);
    console.log(videoData);
    console.log(videoURL);
    $(".display").append(videoURL);
  } else {
    $("#myVideo").empty();
    $("#myVideo").show();
    $("#myVideo").append(
      "<source id='start' type='video/mp4' src='" + videoData + "' />"
    );
    // console.log("<source id='start' type='video/mp4' src='" + videoData + "' />");
    // $("#myVideo").attr("poster", "");
    var video = document.getElementById("myVideo");
    // console.log(video);
    video.load();
  }
  if (currentStageNum != 0) {
    video.play();
  }
}

function createUI(currentData) {
  console.log("createUI...");
  // console.log(currentData);
  switch (currentData.type) {
    case "text":
      // console.log("text");
      if (
        currentData.next &&
        currentData.next.expectation &&
        currentData.next.expectation.type == "regex"
      ) {
        display = display + createText(currentData.next.expectation.val);
      } else {
        display = display + createText();
      }
      // validateButton();
      break;
    case "button":
    case "quickReply":
      console.log("Switch case button .....");
      /*sum = 0;
      for (i in currentData.next.data) {
        for (j in totalclicks) {
          if (currentData.next.data[i].data == j) {
            sum = sum + totalclicks[j];
          }
        }
      }
      console.log("sum=" + sum);*/
      /*number_of_button_created_perStage_count = 0;
      for (i in currentData.next.data) {
        if (!currentData.next.data[i].type) {
          number_of_button_created_perStage_count++;
        }
      }
      console.log("count=" + number_of_button_created_perStage_count);*/

      // console.log("button / QuickReply");
      display = `<div class="button-list">`;
      for (i in currentData.next.data) {
        //for (j in totalclicks) {
        // console.log(totalclicks[j]);
        //console.log(sum);
        /*count = 0;
        if (!currentData.next.data[i].type) {
          count++;
          console.log("count=" + count);
        }*/

        if (!currentData.next.data[i].type) {
          //for (j in totalclicks) {
          //if (currentData.next.data[i].data == j) {
          //if (number_of_button_created_perStage_count > 1 && sum > 0) {
          display =
            display +
            createButton(
              currentData.next.data[i].data,
              currentData.next.data[i].text
              //  " " +
              //Math.floor((totalclicks[j] / sum) * 100) +
              //"%"
            );
          //} //else {
          //display =
          //display +
          //createButton(
          //currentData.next.data[i].data,
          //currentData.next.data[i].text +
          //" " /*+
          //(totalclicks[j] / sum) * 100 +
          //"%"
          //currentData.next.data[i].count*/
          //);
          //}
          //}
          //}
        } else if (currentData.next.data[i].type === "url") {
          display =
            display +
            createButtonURL(
              currentData.next.data[i].data,
              currentData.next.data[i].text
            );
        } else if (currentData.next.data[i].type === "webView") {
          display =
            display +
            createButtonWebView(
              currentData.next.data[i].data,
              currentData.next.data[i].text
            );
        }
      }

      display = display + `</div>`;
      // console.log(display);
      break;
    case "generic":
      // console.log("generic");
      display = `<div class="carousel-wrap">
      <div class="owl-carousel">`;
      display = display + createGeneric(currentData.next.data);
      display = display + `</div></div>`;
      // console.log("display......==>");
      // console.log(display);
      break;
    default:
      // console.log("Not a type");
      break;
  }

  // if (currentStageNum == flow.stages.length - 1) replayFlow();
  displayChat(display);
}

function displayChat(view) {
  console.log("displayChat...");
  $(".box").append(view);
  setTimeout(() => {
    let classes = document.getElementsByClassName("button");
    for (let element of classes) {
      // console.log(element.firstElementChild.innerHTML.length * 18);
      element.style.width =
        element.firstElementChild.innerHTML.length * 18 + "px";
    }

    // $("body").on("click", ".text-send", event => {
    $(".text-send").click(event => {
      // console.log(event);
      let btn = event.currentTarget;
      btn.style.display = "none";
      btn.parentElement.classList.toggle("active");
      btn.parentElement.style.padding = "0px";
      btn.parentElement.addEventListener("animationend", () => {
        btn.parentElement.classList.remove("active");
        btn.parentElement.classList.add("remove");
        getNextStageData();
      });
    });
    // $(".text-send-idle").click(event => {
    //   let el = event.currentTarget;
    //   el.lastElementChild.style.display = "block";
    //   el.firstElementChild.style.display = "none";
    //   el.style.float = "right";
    //   el.style["margin-right"] = "1%";
    //   el.classList.add("text-send-transition");
    //   el.addEventListener("animationend", () => {
    //     el.classList.remove("text-send-transition");
    //     el.classList.remove("text-send-idle");
    //     el.classList.add("text-send");
    //     el.style.width = "34px";
    //   });
    // });
  });
}

function clearChat() {
  console.log("clearChat...");
  $(".box").empty();
  $("iframe").remove();
}

function createButton(data, text, count) {
  console.log("Create Button");
  // console.log("data", data);
  // console.log("text", text);
  return (
    `<div class="button" id="` +
    data +
    `" value="` +
    data +
    `">
    <span class="button-text" value='` +
    data +
    `'>` +
    text +
    `</span>
    <svg
      class="button-complete"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path
        d="M34.912 50.75l10.89 10.125L67 36.75"
        fill="none"
        stroke="#333"
        stroke-width="6"
      />
    </svg>
  </div>`
  );
}

function createButtonURL(data, text) {
  // console.log("Create Button URL");
  // console.log("data", data);
  // console.log("text", text);
  return (
    ` <div class="button" >
  <span class="button-text" type='url' value='` +
    data +
    `'>` +
    text +
    `</span>
  <svg
    class="button-complete"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <path
      d="M34.912 50.75l10.89 10.125L67 36.75"
      fill="none"
      stroke="#333"
      stroke-width="6"
    />
  </svg>
</div>`
  );
}

function createButtonWebView(data, text) {
  // console.log("Create Button Web View");
  // console.log("data", data);
  // console.log("text", text);
  return (
    `<button class='response-button' onclick='$("iframe").show();$(this).hide();'>WebView</button><iframe class='response-webview' src='` +
    data +
    `' onclick='getNextStageData();'style='display:none;'>` +
    text +
    `</iframe>`
  );
  // return (
  //   `<iframe class='video' src='` +
  //   data +
  //   `' onclick='getNextStageData();' >` +
  //   text +
  //   `</iframe><script>showSkip();</script>`
  // );
}

function createText(pattern) {
  // console.log("Create Text");
  // console.log(pattern);
  if (pattern == undefined) {
    pattern = /.+/;
  } else {
    pattern = `/` + pattern + `/`;
  }
  // return (
  //   `<input id='name' class='response-text' type='text' onkeyup='validate(` +
  //   pattern +
  //   `);' placeholder='enter here ...' /> <button class='send' disabled onclick='getNextStageData();'>Send</button>`
  // );
  return (
    `<div class="text-field">
  <input type="text" placeholder='Type here ...' class="text-input" onkeyup="validate(` +
    pattern +
    `)">
  <button disabled type="submit" class="text-send">
    <span class="confirm-button">Send</span>
    <div class="loader"></div>
  </button>

  <svg class="text-complete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M34.912 50.75l10.89 10.125L67 36.75" fill="none" stroke="#333" stroke-width="6"></path>
  </svg>
</div>`
  );
}

function createGeneric(data) {
  // console.log("Create Carousel");
  // console.log("data", data);
  var carousel = "";
  for (i in data) {
    // console.log("Carousel -> Next -> Data[]", i);
    var value =
      `<div class="item">
      <h3>` +
      data[i].title +
      `</h3><img src='` +
      data[i].image +
      `' /><h5>` +
      data[i].text +
      `</h5>` +
      carouselButtons(data[i].buttons) +
      `</div>`;
    carousel = carousel + value;
  }
  // console.log("carousel........=> ", carousel);
  return carousel;
}

function carouselButtons(buttons) {
  // console.log("Carousel Buttons");
  var genericButtons = "";
  for (i in buttons) {
    // console.log("Carousel -> Next -> Data[] -> Buttons[]" + i);
    genericButtons =
      genericButtons + createButton(buttons[i].data, buttons[i].text);
  }
  return genericButtons;
}

// function replayFlow() {
//   // console.log("replayFlow()");
//   currentStageNum = -1;
//   var replay = "replay";
//   display = display + createButton(replay, replay);
//   // console.log("replayFlow()");
//   currentStageNum = -1;
//   var replay = "replay";
//   display = display + createButton(replay, replay);
// }

function validate(pattern) {
  //var pattern = /^[a-zA-Z]+$/;
  // console.log("validate...");
  // console.log(pattern);
  var input = $(".text-input").val();
  // console.log("response-text.val() = ", input);
  if (input == "" || !input) {
    $(".text-input").css("border-bottom", "2px solid #F90A0A");
    $(".text-send").attr("disabled", true);
    $(".text-send").css("background-color: #333333c9");
    // showLoader();
  } else if (pattern.test(input) && input != "") {
    // console.log("correct input...");
    $(".text-send").attr("disabled", false);
    // hideLoader();
    $(".text-input").css("border-bottom", "2px solid #34F458");
    $(".text-send").css("background-color: #333");
  } else {
    // console.log("reject input...");
    $(".text-send").attr("disabled", true);
    $(".text-input").css("border-bottom", "2px solid #F90A0A");
    $(".text-send").css("background-color: #333333c9");
    // showLoader();
  }
}

function hideLoader() {
  $(".loader").attr("style", "display:none");
  $(".loader").attr("width", "22%");
  $(".confirm-button").attr("style", "display :block");
}

function showLoader() {
  $(".loader").attr("style", "display:block");
  $(".loader").attr("width", "34");
  $(".confirm-button").attr("style", "display :none");
}

/*$("body").on("click", ".button", event => {
  event.preventDefault();
  console.log("data in saving process....");

  $.ajax({
    url: "https://pixie.jubi.ai/videoConversation/savedata",
    type: "POST",
    data: totalclicks.serialize(),
    contentType: "Application/json",
    success: function(data) {
      console.log("data::::" + data);
    }
  });
});*/

/*$(document).ready(function() {
  $.ajax({
    type: "get",
    url: "https://pixie.jubi.ai/videoConversation/getdata",
    contentType: "Application/json"
  })
    .done(function(result) {
      for (let i = 0; i < result.length; i++) {
        /*var output = `{` + i + `:` + result[i]`}`;
        console.log(output);*/
/*console.log("result:::::" + result);

        event.preventDefault();
      }
    })
    .fail(function(e) {
      console.log(e);
    });
});*/
