class Calendar {
    static Gregorian = new Calendar(0);
    static Julian = new Calendar(1);

    static toString(value) {
      if (value == this.Gregorian.value) {
        return "Gregorian"
      }
      else {
        return "Julian"
      }
    }
  
    constructor(value) {
      this.value = value;
    }
  }
  
  
  export default Calendar;