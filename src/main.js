var countdownUnits = ['days', 'hours', 'minutes', 'seconds'];
var countDownDate = new Date("Aug 1, 2023 00:06:00").getTime();

var previousValues = {
  'days': null,
  'hours': null,
  'minutes': null,
  'seconds': null
};

// store all selectors so we don't have to query the DOM every interval
var flaps = {}, flapFronts = {}, flapBacks = {}, unitTops = {}, unitBottoms = {};
countdownUnits.forEach(unit => {
  flaps[unit] = document.querySelector('#' + unit + ' .flap');
  flapFronts[unit] = document.querySelector('#' + unit + ' .flap-front');
  flapBacks[unit] = document.querySelector('#' + unit + ' .flap-back');
  unitTops[unit] = document.querySelector('#' + unit + ' .time-card-top');
  unitBottoms[unit] = document.querySelector('#' + unit + ' .time-card-bottom');
});

function animatedCountdown() {
  var timeNow = new Date().getTime();
  var timeDifference = countDownDate - timeNow;
  console.log("countDownDate ", countDownDate);
  console.log("timeNow ", timeNow);
  console.log("timedifference ", timeDifference);

  countdownUnits.forEach(unit => {
    var timeLeft;
    switch (unit) {
      case 'days':
        timeLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        break;
      case 'hours':
        timeLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        break;
      case 'minutes':
        timeLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        break;
      case 'seconds':
        timeLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);
        break;
    }

    // only run the animation if the time left has changed.
    if (previousValues[unit] !== timeLeft) {
      var timeLeftString = timeLeft.toString().padStart(2, "0");
      unitTops[unit].innerHTML = timeLeftString;
      flapBacks[unit].innerHTML = timeLeftString;

      var animation = flaps[unit].animate([
        { transform: 'rotateX(0)' },
        { transform: 'rotateX(-180deg)' },
      ], {
        duration: 400,
        easing: 'ease-in-out',
        fill: 'forwards',
      });

      animation.onfinish = function () {
        flaps[unit].style.transform = 'rotateX(0)';
        // set the current time on the now hidden elements.
        flapFronts[unit].innerHTML = timeLeftString;
        unitBottoms[unit].innerHTML = timeLeftString;
      };

    }

    previousValues[unit] = timeLeft;
  });
}

animatedCountdown();

setInterval(animatedCountdown, 1000);
