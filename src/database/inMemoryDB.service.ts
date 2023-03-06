interface BasicItem {
  id: string;
}
export class InMemoryDBService<T extends BasicItem> {
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

  setIdToNull = async (id: string, field: keyof T) => {
    const searchField = String(field);

    this.array = this.array.map((item) => {
      for (const [key, value] of Object.entries(item)) {
        if (key == searchField && value == id) {
          const updatedItem = { ...item };
          updatedItem[searchField] = null;
          return updatedItem;
        }
      }
      return item;
    });
  };
}
