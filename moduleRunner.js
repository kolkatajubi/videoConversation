var flow = {
  _id: {
    $oid: "5d1a002a8d4cc3b9d49d1e5a"
  },
  flowId: "purchase",
  projectId: "parramatoPrudentProduction_571731615155",
  id: "parramatoPrudentProduction_571731615155-purchase",
  stages: [
    {
      text: [
        " Hey, Please provide your mobile number and PAN to validate your FundzBazar account."
      ],
      type: "text",
      stage: "panMobile",
      next: {
        post: [
          {
            invalidMessage: "",
            url:
              "      http://localhost:8125/adapter/purchase/post/panMobile  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/panMobile",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Could you please share your mobile number?"],
      type: "text",
      stage: "mobile",
      next: {
        post: [
          {
            invalidMessage:
              'Oh no, looks like the Mobile number you have put is incorrect. You can type "cancel" incase you wish to get out of this conversation',
            url: "   http://localhost:8125/adapter/purchase/post/mobile      ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Please help me with your PAN."],
      type: "text",
      stage: "pan",
      next: {
        post: [
          {
            invalidMessage:
              'Oh no, looks like the PAN you have put is incorrect. You can type "cancel" incase you wish to get out of this conversation',
            url:
              "     http://localhost:8125/adapter/purchase/post/pan          ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Please enter your OTP."],
      type: "text",
      stage: "otp",
      next: {
        post: [
          {
            invalidMessage:
              'Oops, the OTP does not match the one I have sent you 😔. You can type "cancel" incase you wish to get out of this conversation',
            url: "   http://localhost:8125/adapter/purchase/post/otp      ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/otp",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: ["Would you like to invest in lumpsum or SIP?"],
      type: "quickReply",
      stage: "investmentType",
      next: {
        post: [
          {
            invalidMessage:
              'Please choose one of the following. You can type "cancel" incase you wish to get out of this conversation',
            url:
              "       http://localhost:8125/adapter/purchase/post/investmentType  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        data: [
          {
            data: "Sip",
            text: "Sip"
          },
          {
            data: "lumpsum",
            text: "lumpsum"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [
        " Please tell me the scheme you would like to invest in (eg: HDFC Equity fund growth)"
      ],
      type: "text",
      stage: "askSchemeName",
      next: {
        post: [
          {
            invalidMessage:
              'Hey, kindly select a proper scheme 😊. You can type "cancel" incase you wish to get out of this conversation',
            url:
              "      http://localhost:8125/adapter/purchase/post/askSchemeName  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [
        " Choose among the closest schemes, or type if you wish to invest in a different scheme."
      ],
      type: "text",
      stage: "showSchemeName",
      next: {
        post: [
          {
            invalidMessage:
              'Please select a proper scheme name 😊. You can type "cancel" incase you wish to get out of this conversation',
            url:
              "      http://localhost:8125/adapter/purchase/post/showSchemeName      ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/showSchemeName",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Please select your holding pattern"],
      type: "text",
      stage: "holding",
      next: {
        post: [
          {
            invalidMessage:
              'Sorry, but that\'s not a valid holding pattern 😕. You can type "cancel" incase you wish to get out of this conversation',
            url: "     http://localhost:8125/adapter/purchase/post/holding  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/holding",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [
        " You already seem to be have an investment with the selected fund. Would you like to add this to existing investment?"
      ],
      type: "quickReply",
      stage: "additional",
      next: {
        post: [
          {
            invalidMessage:
              'Please help us with this detail. You can type "cancel" incase you wish to get out of this conversation',
            url: "   http://localhost:8125/adapter/purchase/post/additional  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        data: [
          {
            data: "Yes",
            text: "Yes"
          },
          {
            data: "No",
            text: "No"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [
        "Can you please let us know they payment mode? You can choose to self initialize or through your advisor (advisor codes available below)"
      ],
      type: "text",
      stage: "euin",
      next: {
        post: [
          {
            invalidMessage:
              'Not a valid payment mode. You can type "cancel" incase you wish to get out of this conversation',
            url: " http://localhost:8125/adapter/purchase/post/euin  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/euin",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [
        "In order to proceed, please read and agree to our terms and conditions - link "
      ],
      type: "text",
      stage: "agreement",
      next: {
        post: [
          {
            invalidMessage:
              'Hey, you have to accept and agree by clicking this button to proceed. You can type "cancel" incase you wish to get out of this conversation',
            url: "  http://localhost:8125/adapter/purchase/post/agreement",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/agreement",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: ["Let us know the folio you wish to invest in."],
      type: "text",
      stage: "folio",
      next: {
        post: [
          {
            invalidMessage:
              'Not a valid folio. You can type "cancel" incase you wish to get out of this conversation',
            url: " http://localhost:8125/adapter/purchase/post/folio  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/folio",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Let us know the option you prefer"],
      type: "text",
      stage: "divOps",
      next: {
        post: [
          {
            invalidMessage:
              'Oh no, looks like this is not valid 😦 You can type "cancel" incase you wish to get out of this conversation',
            url: " http://localhost:8125/adapter/purchase/post/divOps  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/divOps",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Tell me the amount you would like to invest."],
      type: "text",
      stage: "amount",
      next: {
        post: [
          {
            invalidMessage:
              'Not a valid amount. You can type "cancel" incase you wish to get out of this conversation',
            url: " http://localhost:8125/adapter/purchase/post/amount  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/amount",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: ["Which date of the month would you like to invest?"],
      type: "text",
      stage: "sipDay",
      next: {
        post: [
          {
            invalidMessage:
              'Please choose a proper day. You can type "cancel" incase you wish to get out of this conversation',
            url: "  http://localhost:8125/adapter/purchase/post/sipDay  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/sipDay",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [
        "How many Months would you like to invest? Anything equal to or more than 12 works!!."
      ],
      type: "text",
      stage: "sipInstallments",
      next: {
        post: [
          {
            type: "api",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            invalidMessage: "",
            validMessage: "",
            requestType: "POST",
            url:
              " http://localhost:8125/adapter/purchase/post/sipInstallments  "
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Please select your choice of payment"],
      type: "text",
      stage: "bankMandate",
      next: {
        post: [
          {
            invalidMessage:
              'Not a valid bank mandate. You can type "cancel" incase you wish to get out of this conversation',
            url: " http://localhost:8125/adapter/purchase/post/bankMandate  ",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ],
        pre: [
          {
            url: "http://localhost:8125/adapter/purchase/pre/bankMandate",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            },
            type: "api"
          }
        ]
      },
      skipGhost: true
    },
    {
      text: [" Thanks."],
      type: "text",
      stage: "summary",
      next: {
        pre: [
          {
            invalidMessage: "",
            url: "http://localhost:8125/adapter/purchase/pre/summary",
            validMessage: "",
            type: "api",
            requestType: "POST",
            respStates: {
              Success: "200",
              Failed: "203"
            }
          }
        ]
      },
      skipGhost: true
    }
  ]
};

var theme = {
  default: "",
  dark: "https://pixie.jubi.ai/videoParramato/static/css/styledark.css",
  light: "https://pixie.jubi.ai/videoParramato/static/css/stylexls.css"
};
var currentStageNum = -1; // Stores current stage number
var flowJSON = {}; // Stores flow key(stage name) - value(stage data) pair
var currentData = {}; // Stores current stage data
var display = ""; // HTML DOM elements to be displayed
var status = 0; // Tracks if button is displayed or not
var fullscreen = 0; // Tracks if the view is fullscreen or not
// var base64loaded = "not yet"; // Checks if base64 value of video is loaded
// var videoData = {}; // Stores the base64 data of video

//======================================================================================
restructureData();

$(document).ready(() => {
  documentReady();

  document.getElementById("stylesheet").href = theme[flow.theme];
  document.addEventListener("fullscreenchange", exitHandler);
  document.addEventListener("webkitfullscreenchange", exitHandler);
  document.addEventListener("mozfullscreenchange", exitHandler);
  document.addEventListener("MSFullscreenChange", exitHandler);

  exitHandler(document);

  getNextStageData();

  setInterval(() => {
    // console.log("setInterval...");
    var videoDuration = document.getElementById("myVideo").duration.toFixed(2);
    var videoTime = document.getElementById("myVideo").currentTime.toFixed(2);
    // console.log(videoTime);
    if (status == 0)
      if (videoTime >= videoDuration - 0.5) {
        status = 1;
        // console.log("1secs left...");
        createUI(currentData);
      }
    if (videoTime == videoDuration) blurBackground();
  }, 100);
});

function exitHandler(document) {
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    fullscreen = 0;
    // document.getElementById("fs").innerHTML = "FULLSCREEN";
    $(".display")
      .width(640)
      .height(360);
  }
}

function documentReady() {
  $(".display").append(`<div class="video">
  <video id="myVideo" onclick="playPause();">
  </video>
</div>
<img
  src="https://pixie.jubi.ai/videoParramato/static/css/play.png"
  id="playImg"
  onclick="playPause();"
/>
<div class="chat"></div>`);
}

function removeBlurBackground() {
  document.getElementById("myVideo").style.filter = "blur(0px)";
}

function blurBackground() {
  document.getElementById("myVideo").style.filter = "blur(10px)";
}

function playPause() {
  // FS();
  // console.log("play called fullscreen...");
  if (myVideo.paused) {
    $("#playImg").hide();
    removeBlurBackground();
    myVideo.play();
    // document.getElementById("playpause").innerHTML = "PAUSE";
  } else {
    myVideo.pause();
    $("#playImg").show();
    // document.getElementById("playpause").innerHTML = "PLAY";
  }
}

// function FS() {
//   // console.log("fullscreen called...", fullscreen);
//   if (fullscreen == 0) {
//     if (document.body.requestFullscreen) document.body.requestFullscreen();
//     else if (document.body.mozRequestFullScreen)
//       document.body.mozrequestFullscreen();
//     else if (document.body.webkitRequestFullscreen)
//       document.body.webkitRequestFullscreen();
//     else if (document.body.msRequestFullscreen)
//       document.body.msRequestFullscreen();
//     fullscreen = 1;
//     // document.getElementById("fs").innerHTML = "EXIT FULLSCREEN";
//     $(".display")
//       .width("100%")
//       .height("100%");
//   }
// }

// function exitFS() {
//   // console.log("exit fullscreen called...", fullscreen);
//   if (fullscreen == 1) {
//     if (document.exitFullscreen) document.exitFullscreen();
//     else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
//     else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//     else if (document.msExitFullscreen) document.msExitFullscreen();
//     fullscreen = 0;
//     // document.getElementById("fs").innerHTML = "FULLSCREEN";
//     $(".display")
//       .width(640)
//       .height(360);
//   }
// }

// function toggleFS() {
//   // console.log("toggle fullscreen called...", fullscreen);
//   if (fullscreen == 0) FS();
//   else exitFS();
// }

//======================================================================================

// Creating Flow JSON of key(stage name) - value(stage data) pair
function restructureData() {
  for (i = 0; i < flow.stages.length; i++) {
    //   var key = flow.stages[i].stage;
    //   var value = flow.stages[i];
    //   data[key] = value;
    flowJSON[flow.stages[i].stage] = flow.stages[i];
  }
}

// console.log(JSON.stringify(flowJSON, 0, 3));

// getNextStageData("stageWV");
// getNextStageData("offNameGeneric");
// createUI(currentData);

// getNextStageData will return the next stage data and display video
function getNextStageData(nextStage) {
  // console.log("Next Stage ... ", nextStage);
  clearChat();
  removeBlurBackground();
  $("#playImg").hide();
  status = 0;
  currentData = {}; // Stores current stage data
  display = ""; // HTML DOM elements to be displayed
  if (nextStage == undefined) {
    currentStageNum += 1;
    // console.log("currentStageNum : ", currentStageNum);
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
    // console.log("currentStageNum : ", currentStageNum);
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
  // console.log("videoDisplay...");
  // console.log(videoData);
  $("#myVideo").empty();
  $("#myVideo").append(
    "<source id='start' type='video/mp4' src='" + videoData + "' />"
  );
  // console.log("<source id='start' type='video/mp4' src='" + videoData + "' />");
  // $("#myVideo").attr("poster", "");
  var video = document.getElementById("myVideo");
  // console.log(video);
  video.load();
  if (currentStageNum == 0) $("#playImg").show();
  else video.play();
}

function createUI(currentData) {
  // console.log("createUI...");
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
      // console.log("button / QuickReply");
      for (i in currentData.next.data) {
        if (!currentData.next.data[i].type) {
          display =
            display +
            createButton(
              currentData.next.data[i].data,
              currentData.next.data[i].text
            );
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

  if (currentStageNum == flow.stages.length - 1) replayFlow();
  displayChat(display);
}

function displayChat(view) {
  // console.log("displayChat...");
  $(".chat").append(view);
}

function clearChat() {
  // console.log("clearChat...");
  $(".chat").empty();
}

function createButton(data, text) {
  // console.log("Create Button");
  // console.log("data", data);
  // console.log("text", text);
  return (
    `<button class ='response-button' value='` +
    data +
    `' onclick='getNextStageData();' >` +
    text +
    `</button>`
  );
}

function createButtonURL(data, text) {
  // console.log("Create Button URL");
  // console.log("data", data);
  // console.log("text", text);
  return (
    `<button class ='response-button' onclick='window.open("` +
    data +
    `");'>` +
    text +
    "</button>"
  );
}

function createButtonWebView(data, text) {
  // console.log("Create Button Web View");
  // console.log("data", data);
  // console.log("text", text);
  return (
    `<button class='response-button' onclick='$("iframe").show();$(this).hide();'>WebView</button><iframe class='response-webview' src='` +
    data +
    `' onclick='getNextStageData();' style='display:none;'>` +
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

// function createSkip() {
//   return `<button class ='skip' value='skip' onclick='getNextStageData();' style='display:none;'>Skip</button>`;
// }

// function showSkip() {
//   $(".skip").show();
// }

function createText(pattern) {
  // console.log("Create Text");
  // console.log(pattern);
  if (pattern == undefined) {
    pattern = /.+/;
  } else {
    pattern = `/` + pattern + `/`;
  }
  return (
    `<input id='name' class='response-text' type='text' onkeyup='validate(` +
    pattern +
    `);' placeholder='enter here ...' /> <button class='send' disabled onclick='getNextStageData();'>Send</button>`
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

function replayFlow() {
  // console.log("replayFlow()");
  currentStageNum = -1;
  display =
    display +
    `<button class ='response-button' value='replay' onclick='getNextStageData();'>Replay</button>`;
}

function validate(pattern) {
  //var pattern = /^[a-zA-Z]+$/;
  // console.log("validate...");
  // console.log(pattern);
  var input = $(".response-text").val();
  // console.log("response-text.val() = ", input);
  if (input == "") {
    $(".response-text").css("border-bottom", "2px solid #F90A0A");
    $(".send").attr("disabled", true);
  } else if (pattern.test(input) && input != "") {
    // console.log("correct input...");
    $(".send").attr("disabled", false);
    $(".response-text").css("border-bottom", "2px solid #34F458");
  } else {
    // console.log("reject input...");
    $(".send").attr("disabled", true);
    $(".response-text").css("border-bottom", "2px solid #F90A0A");
  }
}
