class Singleton {
    constructor() {
      if (!Singleton.instance) {
        // Nếu chưa có instance, tạo mới và lưu lại
        this.data = "Initial data";
        Singleton.instance = this;
      }
  
      // Trả về instance đã tồn tại
      return Singleton.instance;
    }
  
    getData() {
      return this.data;
    }
  
    setData(newData) {
      this.data = newData;
    }
  }