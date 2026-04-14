const itemoperations = {
  items: [],
  add(item) {
    this.items.push(item);
  },
  search(id) {
    return this.items.find(item => item.id === id);
  }
};