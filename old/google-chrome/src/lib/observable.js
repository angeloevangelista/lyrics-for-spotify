const observable = initialValue => {
  const observers = [];

  return {
    value: initialValue || '',

    subscribe: fn => observers.push(fn) - 1,

    unsubscribe: index => observers.splice(index, 1),

    next(nextValue) {
      this.value = nextValue;
      observers.forEach(observer => observer(nextValue));
    },
  }
}