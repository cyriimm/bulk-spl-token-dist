class Queue {
  data = [];

  running = false;

  error = [];

  subscribe = (listener) => {
    this.listener = listener;
  };

  populateData = (data) => {
    this.data.push(data);
  };

  depopulateData = () => {
    this.data.shift();
  };

  run = async () => {
    if (this.running === true) return;
    if (this.data.length === 0) return;

    try {
      this.running = true;

      await this.data[0][0]();

      const data = this.data.shift();
      this.listener((prev) => {
        return [...prev, data[1], 'success'];
      });
      this.running = false;
    } catch (err) {
      console.log(err);
      const data = this.data.shift();
      this.listener((prev) => {
        return [...prev, data[1], 'failed'];
      });

      this.running = false;
    }
  };
}

export default Queue;
