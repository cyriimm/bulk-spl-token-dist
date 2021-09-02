class Queue {
  promises = [];

  running = false;

  populatePromises = (promise) => {
    this.promises.push(promise);
  };

  depopulatePromises = (promsise) => {
    this.promises.shift();
  };

  run = async () => {
    if (this.running === true) return;
    if (this.promises.length === 0) return;

    try {
      this.running = true;
      console.log('starting');
      await this.promises[0]();

      this.promises.shift();
      console.log('ending');
      this.running = false;
    } catch (err) {
      console.log(err);
      this.promises.shift();
      this.running = false;
    }
  };
}

export default Queue;
