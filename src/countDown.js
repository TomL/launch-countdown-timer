export default class CountDown {
  constructor(countDownID, endDate) {
    this.countDownDate = endDate.getTime();
    this.countdownUnits = ['days', 'hours', 'minutes', 'seconds'];
    // we store the previous values so we can compare them to the current values and run the animation when the value changes.
    this.previousValues = {};

    // store all selectors so we don't have to query the DOM every interval
    this.unitTops = {};
    this.unitBottoms = {};
    this.flaps = {};
    this.flapFronts = {};
    this.flapBacks = {};

    this.countdownUnits.forEach(unit => {
      this.unitTops[unit] = document.querySelector(`#${countDownID} .${unit} .time-card-top`);
      this.unitBottoms[unit] = document.querySelector(`#${countDownID} .${unit} .time-card-bottom`);
      this.flaps[unit] = document.querySelector(`#${countDownID} .${unit} .flap`);
      this.flapFronts[unit] = document.querySelector(`#${countDownID} .${unit} .flap-front`);
      this.flapBacks[unit] = document.querySelector(`#${countDownID} .${unit} .flap-back`);
    });
  }

  animatedCountdown() {
    const timeNow = new Date().getTime();
    const timeDifference = this.countDownDate - timeNow;

    if (timeDifference < 0) {
      this.countdownUnits.forEach(unit => {
        this.unitTops[unit].innerHTML = '00';
        this.flapBacks[unit].innerHTML = '00';
        this.unitBottoms[unit].innerHTML = '00';
        this.flapFronts[unit].innerHTML = '00';
      });
      return;
    }

    this.countdownUnits.forEach(unit => {
      const timeLeft = this.calculateTimeLeft(unit, timeDifference);

      if (this.previousValues[unit] !== timeLeft) {
        const timeLeftString = timeLeft.toString().padStart(2, "0");
        this.unitTops[unit].innerHTML = timeLeftString;
        this.flapBacks[unit].innerHTML = timeLeftString;

        // the animation works by rotating our 'flap' on it's center x axis 180 degrees. The top of the flap has a front and back side, and when rotating gives our flip clock effect.
        const animation = this.flaps[unit].animate([
          { transform: 'rotateX(0)' },
          { transform: 'rotateX(-180deg)' },
        ], {
          duration: 400,
          easing: 'ease-in-out',
          fill: 'forwards',
        });

        animation.onfinish = () => {
          // reset the animation so it can be played again
          this.flaps[unit].style.transform = 'rotateX(0)';
          // set the current time on the elements that are now hidden.
          this.flapFronts[unit].innerHTML = timeLeftString;
          this.unitBottoms[unit].innerHTML = timeLeftString;
        };
        this.previousValues[unit] = timeLeft;
      }
    });
  }

  calculateTimeLeft(unit, timeDifference) {
    const MS_PER_SECOND = 1000;
    const SECONDS_PER_MINUTE = 60;
    const MINUTES_PER_HOUR = 60;
    const HOURS_PER_DAY = 24;

    switch (unit) {
      case 'days':
        return Math.floor(timeDifference / (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY));
      case 'hours':
        return Math.floor((timeDifference % (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)) / (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
      case 'minutes':
        return Math.floor((timeDifference % (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) / (MS_PER_SECOND * SECONDS_PER_MINUTE));
      case 'seconds':
        return Math.floor((timeDifference % (MS_PER_SECOND * SECONDS_PER_MINUTE)) / MS_PER_SECOND);
    }
  }

  start() {
    // run on start, and then every 1 second.
    this.animatedCountdown();
    setInterval(() => this.animatedCountdown(), 1000);
  }
}