
//selectors
let mystream;

let count =0;
let people = document.querySelector('.count');
let intro = document.querySelector('.intro');
let male = document.getElementById("male");
let female = document.getElementById("female");
let start = document.querySelector(".container");
let start2 = document.querySelector(".startnow");
let copyLink = document.querySelector('.copylink');
let local = document.querySelector("#local");
let startMeet = document.querySelector('.startmeet');
let muteImg = document.querySelector('.muteImg');

//event listeners


//functions

function clicked()
{ 
    startMeet.remove();
    intro.remove();
    if(male.checked)
    {
    callAvatar(male);
    } else{
    callAvatar(female);
    }
  intro.style.opacity = 0;
  start.classList.add('fadein');
  start.style.opacity =1;
  start2.style.opacity =1;
  copyLink.style.opacity =1;
  nowYes();
}

function callAvatar(avatar)
{
    local.classList.add('avatar');
   local.style.backgroundImage = `url(./assets/${avatar.value}.png)`;
   local.style.backgroundSize = "200px 200px";
}


function nowYes()
{
    
let mute = false;

// client creation
let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

// initialized the client
client.init("f97d47c0e22b4232944b8d1cbfc6dd8d");
  
// creating the channel
client.join(
  "006f97d47c0e22b4232944b8d1cbfc6dd8dIACj5Lx2AlPaegUOUv+cD+sGb/sTUArpPr15wIngfxp7Z3NyD9kAAAAAEABK0cUixLTxYAEAAQDEtPFg",
  "demoo",
  null,
  (uid) => {
    // Create a local stream
    let localStream = AgoraRTC.createStream({
      audio: true,
      video: true,
      
    });
    localStream.init(() => {
    
      mystream = localStream;
      localStream.play("local");
      client.publish(localStream);
    });
  }
);

client.on("stream-added", function (evt) {
  client.subscribe(evt.stream);
});

client.on("stream-subscribed", function (evt) {
  count++;
  updateCount(count);
    // 
  let stream = evt.stream;
  let streamId = String(stream.getId());
  let othersContainer = document.querySelector('.others-container');
  let div = document.createElement("div");
   div.id = streamId;
   othersContainer.style.display = "flex";
   othersContainer.style.textAlign = "left";
   othersContainer.style.justifyContent = "space-around";
   div.style.margin = '0rem 0rem 0.5rem auto';
  //  div.style.border = "2px solid #000";

  othersContainer.appendChild(div);
  stream.play(streamId);
});


// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
 
  let stream = evt.stream;
  let streamId = String(stream.getId());
  stream.close();
  removeVideoStream(streamId);


});
// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
  let stream = evt.stream;
  let streamId = String(stream.getId());
  stream.close();
  removeVideoStream(streamId);
  


});
function removeVideoStream(elementId) {

        let remoteDiv = document.getElementById(elementId);
        if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
        if(count>0)
        {
          count--;
          updateCount(count);
        }
};



}

function updateCount(count)
{
    people.innerHTML = `<span>${count}</span>`;
}
function muteAudio() {
  mystream.muteAudio();
 let muted =  document.querySelector('.btn-grad-1');
 let unmuted = document.querySelector('.btn-grad-2');
 
 muted.classList.add('opacity50');
 muted.classList.remove('opacity100');
 muted.style.pointerEvents = "none";
 unmuted.style.pointerEvents = "all";
  unmuted.classList.add('opacity100');
  unmuted.classList.remove('opacity50');
  muteImg.style.opacity = 1;

  
}

function unmuteAudio() {
  mystream.unmuteAudio();
  let muted =  document.querySelector('.btn-grad-1');
 let unmuted = document.querySelector('.btn-grad-2');

 muted.classList.add('opacity100');
 unmuted.classList.remove('opacity100');
 unmuted.classList.remove('opacity50');
  unmuted.classList.add('opacity50');
 unmuted.style.pointerEvents = "none";
 muted.style.pointerEvents = "all";
 
 muteImg.style.opacity = 0;


}

function leaveMeet()
{
  document. location. reload();
  

}

function copyToClipboard() {

  // Create a "hidden" input
  var aux = document.createElement("input");

  // Assign it the value of the specified element
  aux.setAttribute("value", document.getElementById("p").innerHTML);

  // Append it to the body
  document.body.appendChild(aux);

  // Highlight its content
  aux.select();

  // Copy the highlighted text
  document.execCommand("copy");

  // Remove it from the body
  document.body.removeChild(aux);
 
  document.querySelector("#p").classList.toggle('copytoggle');
  
 document.querySelector(".copied").textContent = "copied";
   
}
