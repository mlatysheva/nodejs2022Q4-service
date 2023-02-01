interface BasicItem {
  id: string;
}

export class InMemoryDB<T extends BasicItem> {
  private array: Array<T> = [];

  getAll = async (): Promise<Array<T>> => {
    return this.array;
  };

  getOne = async (id: string): Promise<T | null> => {
    return this.array.find((item) => item.id === id) || null;
  };

  post = async (item: T): Promise<T> => {
    this.array.push(item);
    return item;
  };

  update = async (id: string, data: T): Promise<T | null> => {
    let item = await this.getOne(id);

    item = {
      ...item,
      ...data,
    };

    const indexItem = this.array.findIndex((item) => item.id === id);

    if (indexItem < 0) {
      return null;
    }

    this.array = [
      ...this.array.slice(0, indexItem),
      item,
      ...this.array.slice(indexItem + 1),
    ];

    return item;
  };

  delete = async (id: string): Promise<boolean> => {
    const item = this.getOne(id);

    if (!item) {
      return false;
    }

    this.array = this.array.filter((item) => item.id !== id);
    return true;
  };
}
