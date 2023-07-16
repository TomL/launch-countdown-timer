export default class CountDown {
  constructor(dateString) {
    this.countDownDate = new Date(dateString).getTime();
    this.countdownUnits = ['days', 'hours', 'minutes', 'seconds'];
    this.previousValues = {};

    // store all selectors so we don't have to query the DOM every interval
    this.unitTops = {};
    this.unitBottoms = {};
    this.flaps = {};
    this.flapFronts = {};
    this.flapBacks = {};

    this.countdownUnits.forEach(unit => {
      this.unitTops[unit] = document.querySelector('#' + unit + ' .time-card-top');
      this.unitBottoms[unit] = document.querySelector('#' + unit + ' .time-card-bottom');
      this.flaps[unit] = document.querySelector('#' + unit + ' .flap');
      this.flapFronts[unit] = document.querySelector('#' + unit + ' .flap-front');
      this.flapBacks[unit] = document.querySelector('#' + unit + ' .flap-back');
    });
  }

  animatedCountdown() {
    const timeNow = new Date().getTime();
    const timeDifference = this.countDownDate - timeNow;

    this.countdownUnits.forEach(unit => {
      const timeLeft = this.calculateTimeLeft(unit, timeDifference);

      if (this.previousValues[unit] !== timeLeft) {
        const timeLeftString = timeLeft.toString().padStart(2, "0");
        this.unitTops[unit].innerHTML = timeLeftString;
        this.flapBacks[unit].innerHTML = timeLeftString;

        const animation = this.flaps[unit].animate([
          { transform: 'rotateX(0)' },
          { transform: 'rotateX(-180deg)' },
        ], {
          duration: 400,
          easing: 'ease-in-out',
          fill: 'forwards',
        });

        animation.onfinish = () => {
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
    let timeLeft;

    switch (unit) {
      case 'days':
        timeLeft = Math.floor(timeDifference / (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY));
        break;
      case 'hours':
        timeLeft = Math.floor((timeDifference % (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)) / (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
        break;
      case 'minutes':
        timeLeft = Math.floor((timeDifference % (MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) / (MS_PER_SECOND * SECONDS_PER_MINUTE));
        break;
      case 'seconds':
        timeLeft = Math.floor((timeDifference % (MS_PER_SECOND * SECONDS_PER_MINUTE)) / MS_PER_SECOND);
        break;
    }
    return timeLeft;
  }
  start() {
    this.animatedCountdown();
    setInterval(() => this.animatedCountdown(), 1000);
  }
}