class LoopMonitor {
  constructor(arr, options = {}) {
    this.arr = arr;
    this.frequency = options.frequency || 10; // percentage point, default to 10%
    this.totalLoops = arr.length;
    this.thresholdTime = options.thresholdTime || 1000; // time in ms to decide if loop is long, default to 1000ms
    this.isLongLoop = false;
    this.currentLoop = 0;
    this.incrementCallback = null;
    this.monitoringStarted = false;
    this.startTime = null;
    this.endTime = null;
  }

  startMonitoring() {
    this.startTime = Date.now();
    this.monitoringStarted = true;
  }

  endMonitoring() {
    this.endTime = Date.now();
    this.evaluateLoopTime();
  }

  evaluateLoopTime() {
    const loopTime = this.endTime - this.startTime;

    if (loopTime > this.thresholdTime) {
      this.isLongLoop = true;
      this.incrementCallback = this.logProgress.bind(this);
    } else {
      this.incrementCallback = null;
    }
  }

  increment() {
    if (!this.monitoringStarted) {
      this.startMonitoring();
    }

    this.currentLoop++;

    if (this.incrementCallback) {
      this.incrementCallback();
    }

    if (this.currentLoop === this.totalLoops) {
      this.endMonitoring();
    }
  }

  logProgress() {
    const progress = (this.currentLoop / this.totalLoops) * 100;

    if (progress % this.frequency === 0) {
      console.log(`Progress: ${progress.toFixed(2)}%`);
    }
  }
}

export default LoopMonitor;
